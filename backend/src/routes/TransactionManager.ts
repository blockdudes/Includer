import * as express from 'express';
import {  Keypair, TransactionBuilder, BASE_FEE, Networks, Operation, Asset, SorobanRpc, Contract, Address, xdr, contract, Transaction, Memo, MemoType, scValToNative } from '@stellar/stellar-sdk';
import Server from '@stellar/stellar-sdk';
import registeryManager, { recordTransaction } from './RegisteryManager';
import { db } from '../config/firebaseConfig';
import { authenticateToken } from '../utils/helper';
//fund- https://friendbot.stellar.org/?addr=GBLBJD5KYVUFCJ7FAGEABF4HZ5YVRR7OO2IWR6URQOX447II3J2AFG5X

const serverUrl = "https://soroban-testnet.stellar.org:443";
const server = new SorobanRpc.Server(serverUrl);
const contractAddress = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY";
const tokenContractAddress = "CDQ56Q2MGOI53XVQMARVHFWI6FVM7FG7QHAT22Q2Z7L7W5WU6IYXED4V";
const defaultFee = '100';
const networkPassphrase = Networks.TESTNET;

interface TransactionResponse {
    status: string;
    hash?: string;
    resultMetaXdr?: string;
}

async function waitForTransactionCompletion(txHash: string): Promise<TransactionResponse> {
    let transactionStatus: TransactionResponse; // Use 'any' type here since the SDK doesn't provide an exported type
    while (true) {
        transactionStatus = await server.getTransaction(txHash) as TransactionResponse;
        if (transactionStatus.status !== "NOT_FOUND") break;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return convertTransactionResponse(transactionStatus);
}

async function setAllowance(
    ownerAddress: string, 
    spenderAddress: string, 
    amount: bigint, 
    keypair: Keypair
): Promise<void> {
    const tokenContract = new Contract(tokenContractAddress); // Ensure the contract is linked with the server

    // Convert addresses and amount to the required XDR format
    const ownerScAddress = xdr.ScVal.scvAddress(new Address(ownerAddress).toScAddress());
    const spenderScAddress = xdr.ScVal.scvAddress(new Address(spenderAddress).toScAddress());
    const amountScVal = xdr.ScVal.scvI128(new xdr.Int128Parts({
        lo: xdr.Uint64.fromString(amount.toString()),
        hi: xdr.Int64.fromString('0')
    }));

    // Get the latest ledger to set the expiration ledger
    const ledger = await server.getLatestLedger();
    const expirationLedger = xdr.ScVal.scvU32(ledger.sequence + 1);

    // Create the operation to call the 'approve' method
    const approveOperation = tokenContract.call("approve", ownerScAddress, spenderScAddress, amountScVal, expirationLedger);

    // Get the source account and build the transaction
    const sourceAccount = await server.getAccount(keypair.publicKey());
    const transaction = new TransactionBuilder(sourceAccount, {
        fee: '100',
        networkPassphrase: Networks.TESTNET
    })
        .addOperation(approveOperation)
        .setTimeout(30)
        .build();

    // Sign and send the transaction
    transaction.sign(keypair);
    const response = await server.sendTransaction(transaction);
    console.log(`Transaction hash: ${response.hash}`);
}

async function transferToken(
    fromAddress: string, 
    toAddress: string, 
    amount: bigint, 
    keypair: Keypair
): Promise<void> {
    const tokenContract = new Contract(tokenContractAddress); // Ensure the contract is linked with the server

    // Convert addresses and amount to the required XDR format
    const fromScAddress = xdr.ScVal.scvAddress(new Address(fromAddress).toScAddress());
    const toScAddress = xdr.ScVal.scvAddress(new Address(toAddress).toScAddress());
    const amountScVal = xdr.ScVal.scvI128(new xdr.Int128Parts({
        lo: xdr.Uint64.fromString(amount.toString()),
        hi: xdr.Int64.fromString('0')
    }));

    // Get the latest ledger to set the expiration ledger
    const ledger = await server.getLatestLedger();
    const expirationLedger = xdr.ScVal.scvU32(ledger.sequence + 1);

    // Create the operation to call the 'transfer' method
    const transferOperation = tokenContract.call("transfer", fromScAddress, toScAddress, amountScVal, expirationLedger);

    // Get the source account and build the transaction
    const sourceAccount = await server.getAccount(keypair.publicKey());
    const transaction = new TransactionBuilder(sourceAccount, {
        fee: '100',
        networkPassphrase: Networks.TESTNET
    })
        .addOperation(transferOperation)
        .setTimeout(30)
        .build();

    // Sign and send the transaction
    transaction.sign(keypair);
    const response = await server.sendTransaction(transaction);
    console.log(`Transaction hash: ${response.hash}`);
}

function convertTransactionResponse(response: any): TransactionResponse {
    // Check if the response indicates a successful transaction
    if (response.status === "SUCCESS" && response.resultMetaXdr) {
        return {
            status: response.status,
            hash: response.hash,
            resultMetaXdr: response.resultMetaXdr.toXDR ? response.resultMetaXdr.toXDR('base64') : undefined // Convert if possible
        };
    }

    // Return status and hash if the transaction is not successful
    return {
        status: response.status,
        hash: response.hash
    };
}


async function buildAndSubmitTransaction(
    sourceAccount: string, 
    operation: xdr.Operation, 
    keypair: Keypair
): Promise<TransactionResponse> {
    const account = await server.getAccount(sourceAccount);
    const transaction = new TransactionBuilder(account, { fee: defaultFee, networkPassphrase })
        .addOperation(operation)
        .setTimeout(30)
        .build();
    console.log("transaction", transaction)

    const preparedTransaction = await server.prepareTransaction(transaction);
    preparedTransaction.sign(keypair);
    const response = await server.sendTransaction(preparedTransaction);
    if (response.status === "PENDING") {
        return await waitForTransactionCompletion(response.hash!);
    }
    return response;
}

async function buildContractOperation(
    contractMethod: string,
    userAddress: string,
    amount: bigint
): Promise<xdr.Operation> {
    const contract = new Contract(contractAddress);
    const userScAddress = xdr.ScVal.scvAddress(new Address(userAddress).toScAddress());
    const amountScVal = xdr.ScVal.scvI128(new xdr.Int128Parts({
        lo: xdr.Uint64.fromString(amount.toString()),
        hi: xdr.Int64.fromString('0')
    }));
    if (contractMethod === "deposit") {
        const token = xdr.ScVal.scvAddress(new Address(tokenContractAddress).toScAddress());
        return contract.call(contractMethod, token, amountScVal, userScAddress);
    }
    return contract.call(contractMethod, userScAddress, amountScVal);

}

async function handleTransaction(
    email: string, 
    amount: bigint, 
    contractMethod: string
): Promise<void> {
    const { publicKey, privateKey } = await getUserStellarAccount(email);
    const keypair = Keypair.fromSecret(privateKey);

    if (contractMethod === "deposit") {
        await setAllowance(publicKey, contractAddress, amount, keypair);
    }
    const operation = await buildContractOperation(contractMethod, publicKey, amount);

    const response = await buildAndSubmitTransaction(publicKey, operation, keypair);
    console.log("response", response)
    if (response.status !== "SUCCESS") {
        throw new Error(`Transaction failed: ${response.resultMetaXdr || 'Unknown error'}`);
    }
    console.log(`Transaction successful: ${response.resultMetaXdr}`);
}

async function executeTransaction(req: express.Request, res: express.Response, contractMethod: string): Promise<void> {
    const { email, amount } = req.body;
    try {
        await handleTransaction(email, BigInt(amount), contractMethod);
        await recordTransaction(email, contractMethod, amount);
        res.status(200).send(`${contractMethod} successful`);
    } catch (error) {
        console.log("error", error)
        res.status(500).send({ message: `${contractMethod} failed`, error: (error as Error).message });
    }
}

async function getUserStellarAccount(email: string): Promise<{publicKey: string, privateKey: string}> {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (snapshot.empty) {
        throw new Error('No matching user found.');
    }
    let accountDetails = {};
    snapshot.forEach(doc => {
        accountDetails = { publicKey: doc.data().publicKey, privateKey: doc.data().privateKey };
    });
    return accountDetails as { publicKey: string, privateKey: string };
}

export const simulateTx = async <ArgType>(
    tx: Transaction<Memo<MemoType>, Operation[]>,
    server: SorobanRpc.Server,
    ): Promise<ArgType> => {
    const response = await server.simulateTransaction(tx);
    
    if (
        SorobanRpc.Api.isSimulationSuccess(response) &&
        response.result !== undefined
    ) {
        return scValToNative(response.result.retval);
    }
    
    throw new Error("cannot simulate transaction");
    };


async function getBalance(email: string) {
    try {
       const { publicKey } = await getUserStellarAccount(email);
       const keypair = Keypair.fromPublicKey(publicKey);
       const source = await server.getAccount(keypair.publicKey());
       const contract = new Contract(contractAddress);

       const userScAddress = xdr.ScVal.scvAddress(new Address(publicKey).toScAddress());
   
       const tx = new TransactionBuilder(source, {
           fee: '100',
           networkPassphrase: Networks.TESTNET
       }).addOperation(contract.call("get_user_balance", userScAddress)).setTimeout(30).build();
       
       const result: any = await simulateTx(tx, server)

       const formattedResult = {
        borrow_balance: result.borrow_balance.toString(),
        borrow_timestamp: result.borrow_timestamp.toString(),
        last_deposit_time: result.last_deposit_time.toString(),
        total_deposit_balance: result.total_deposit_balance.toString()
    };

    return formattedResult;
    } catch (error) {
       console.log("Error fetching balance:", error)
    }
}

// path/to/your/file
async function transferFunds(email: string, recipientEmail: string, amount: bigint): Promise<void> {
    try {
        const sender = await getUserStellarAccount(email);
        const recipient = await getUserStellarAccount(recipientEmail);
    
        const senderKeypair = Keypair.fromSecret(sender.privateKey);
    
        const response = await transferToken(sender.publicKey, recipient.publicKey, amount, senderKeypair);
    } catch (error) {
        throw new Error(`Transfer failed: ${error as Error || 'Unknown error'}`);
    }
}

const transactionManager = express.Router();

// Map the routes to the executeTransaction function with the appropriate contract method
transactionManager.post('/deposit', (req, res) => executeTransaction(req, res, "deposit"));
transactionManager.post('/repay', authenticateToken, (req, res) => executeTransaction(req, res, "repay_token"));
transactionManager.post('/withdraw', authenticateToken, (req, res) => executeTransaction(req, res, "withdraw_token"));
transactionManager.post('/borrow', authenticateToken, (req, res) => executeTransaction(req, res, "borrow_token"));
transactionManager.post('/setAllowance', authenticateToken, (req, res) => executeTransaction(req, res, "setAllowance"));


const jsonString = (data: any) => JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );

transactionManager.get('/getBalance/:email', authenticateToken, (req, res) => {
    const { email } = req.params;
    getBalance(email)
        .then(result => res.status(200).send({ message: "Balance fetched successfully", balance: result }))
        .catch(error => res.status(500).send({ message: "Failed to fetch balance", error: error.message }));
});


export default transactionManager;
    