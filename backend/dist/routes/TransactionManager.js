"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const stellar_sdk_1 = require("@stellar/stellar-sdk");
const firebaseConfig_1 = require("../config/firebaseConfig");
const helper_1 = require("../utils/helper");
//fund- https://friendbot.stellar.org/?addr=GBLBJD5KYVUFCJ7FAGEABF4HZ5YVRR7OO2IWR6URQOX447II3J2AFG5X
const serverUrl = "https://soroban-testnet.stellar.org:443";
const server = new stellar_sdk_1.SorobanRpc.Server(serverUrl);
const contractAddress = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY";
const tokenContractAddress = "CDQ56Q2MGOI53XVQMARVHFWI6FVM7FG7QHAT22Q2Z7L7W5WU6IYXED4V";
const defaultFee = '100';
const networkPassphrase = stellar_sdk_1.Networks.TESTNET;
async function waitForTransactionCompletion(txHash) {
    let transactionStatus; // Use 'any' type here since the SDK doesn't provide an exported type
    while (true) {
        transactionStatus = await server.getTransaction(txHash);
        if (transactionStatus.status !== "NOT_FOUND")
            break;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return convertTransactionResponse(transactionStatus);
}
async function setAllowance(ownerAddress, spenderAddress, amount, keypair) {
    const tokenContract = new stellar_sdk_1.Contract(tokenContractAddress); // Ensure the contract is linked with the server
    // Convert addresses and amount to the required XDR format
    const ownerScAddress = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(ownerAddress).toScAddress());
    const spenderScAddress = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(spenderAddress).toScAddress());
    const amountScVal = stellar_sdk_1.xdr.ScVal.scvI128(new stellar_sdk_1.xdr.Int128Parts({
        lo: stellar_sdk_1.xdr.Uint64.fromString(amount.toString()),
        hi: stellar_sdk_1.xdr.Int64.fromString('0')
    }));
    // Get the latest ledger to set the expiration ledger
    const ledger = await server.getLatestLedger();
    const expirationLedger = stellar_sdk_1.xdr.ScVal.scvU32(ledger.sequence + 1);
    // Create the operation to call the 'approve' method
    const approveOperation = tokenContract.call("approve", ownerScAddress, spenderScAddress, amountScVal, expirationLedger);
    // Get the source account and build the transaction
    const sourceAccount = await server.getAccount(keypair.publicKey());
    const transaction = new stellar_sdk_1.TransactionBuilder(sourceAccount, {
        fee: '100',
        networkPassphrase: stellar_sdk_1.Networks.TESTNET
    })
        .addOperation(approveOperation)
        .setTimeout(30)
        .build();
    // Sign and send the transaction
    transaction.sign(keypair);
    const response = await server.sendTransaction(transaction);
    console.log(`Transaction hash: ${response.hash}`);
}
function convertTransactionResponse(response) {
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
async function buildAndSubmitTransaction(sourceAccount, operation, keypair) {
    const account = await server.getAccount(sourceAccount);
    const transaction = new stellar_sdk_1.TransactionBuilder(account, { fee: defaultFee, networkPassphrase })
        .addOperation(operation)
        .setTimeout(30)
        .build();
    console.log("transaction", transaction);
    const preparedTransaction = await server.prepareTransaction(transaction);
    preparedTransaction.sign(keypair);
    const response = await server.sendTransaction(preparedTransaction);
    if (response.status === "PENDING") {
        return await waitForTransactionCompletion(response.hash);
    }
    return response;
}
async function buildContractOperation(contractMethod, userAddress, amount) {
    const contract = new stellar_sdk_1.Contract(contractAddress);
    const userScAddress = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(userAddress).toScAddress());
    const amountScVal = stellar_sdk_1.xdr.ScVal.scvI128(new stellar_sdk_1.xdr.Int128Parts({
        lo: stellar_sdk_1.xdr.Uint64.fromString(amount.toString()),
        hi: stellar_sdk_1.xdr.Int64.fromString('0')
    }));
    if (contractMethod === "deposit") {
        const token = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(tokenContractAddress).toScAddress());
        return contract.call(contractMethod, token, amountScVal, userScAddress);
    }
    return contract.call(contractMethod, userScAddress, amountScVal);
}
async function handleTransaction(email, amount, contractMethod) {
    const { publicKey, privateKey } = await getUserStellarAccount(email);
    const keypair = stellar_sdk_1.Keypair.fromSecret(privateKey);
    if (contractMethod === "deposit") {
        await setAllowance(publicKey, contractAddress, amount, keypair);
    }
    const operation = await buildContractOperation(contractMethod, publicKey, amount);
    const response = await buildAndSubmitTransaction(publicKey, operation, keypair);
    console.log("response", response);
    if (response.status !== "SUCCESS") {
        throw new Error(`Transaction failed: ${response.resultMetaXdr || 'Unknown error'}`);
    }
    console.log(`Transaction successful: ${response.resultMetaXdr}`);
}
async function executeTransaction(req, res, contractMethod) {
    const { email, amount } = req.body;
    try {
        await handleTransaction(email, BigInt(amount), contractMethod);
        res.status(200).send(`${contractMethod} successful`);
    }
    catch (error) {
        console.log("error", error);
        res.status(500).send({ message: `${contractMethod} failed`, error: error.message });
    }
}
async function getUserStellarAccount(email) {
    const usersRef = firebaseConfig_1.db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (snapshot.empty) {
        throw new Error('No matching user found.');
    }
    let accountDetails = {};
    snapshot.forEach(doc => {
        accountDetails = { publicKey: doc.data().publicKey, privateKey: doc.data().privateKey };
    });
    return accountDetails;
}
async function getBalance(email) {
    try {
        const { publicKey } = await getUserStellarAccount(email);
        const keypair = stellar_sdk_1.Keypair.fromPublicKey(publicKey);
        const source = await server.getAccount(keypair.publicKey());
        const contract = new stellar_sdk_1.Contract(contractAddress);
        const userScAddress = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(publicKey).toScAddress());
        const tx = new stellar_sdk_1.TransactionBuilder(source, {
            fee: '100',
            networkPassphrase: stellar_sdk_1.Networks.TESTNET
        }).addOperation(contract.call("get_user_balance", userScAddress)).setTimeout(30).build();
        const result = await server.simulateTransaction(tx);
        console.log(result);
        return result;
    }
    catch (error) {
        console.log("Error fetching balance:", error);
    }
}
// const getter = async (user:string) => {
//     try {
//        const keypair = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
//        const caller = keypair.publicKey();
//        const provider = new SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
//        const source = await provider.getAccount(caller);
//        const contractAddress = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY";
//        const contract = new Contract(contractAddress);
//        const new_user =  xdr.ScVal.scvAddress(new Address(user).toScAddress());
//        const tx = new TransactionBuilder(source, {
//            fee: '100',
//            networkPassphrase: Networks.TESTNET
//        }).addOperation(contract.call("get_user_balance", new_user)).setTimeout(30).build();
//        const result = await simulateTx(tx, provider)
//        console.log(result)
//     } catch (error) {
//        console.log(error)
//     }
//    }
const transactionManager = express.Router();
// Map the routes to the executeTransaction function with the appropriate contract method
transactionManager.post('/deposit', (req, res) => executeTransaction(req, res, "deposit"));
transactionManager.post('/repay', helper_1.authenticateToken, (req, res) => executeTransaction(req, res, "repay_token"));
transactionManager.post('/withdraw', helper_1.authenticateToken, (req, res) => executeTransaction(req, res, "withdraw_token"));
transactionManager.post('/borrow', helper_1.authenticateToken, (req, res) => executeTransaction(req, res, "borrow_token"));
transactionManager.post('/setAllowance', helper_1.authenticateToken, (req, res) => executeTransaction(req, res, "setAllowance"));
transactionManager.get('/getBalance/:email', helper_1.authenticateToken, (req, res) => {
    const { email } = req.params;
    getBalance(email)
        .then(result => res.status(200).send({ message: "Balance fetched successfully", balance: result }))
        .catch(error => res.status(500).send({ message: "Failed to fetch balance", error: error.message }));
});
exports.default = transactionManager;
