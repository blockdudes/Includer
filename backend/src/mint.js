const { Keypair, TransactionBuilder, BASE_FEE, Networks, Operation, Asset, SorobanRpc, Contract, Address, xdr, contract, Transaction, Memo, MemoType, scValToNative } = require('@stellar/stellar-sdk');
const serverUrl = "https://soroban-testnet.stellar.org:443";
const server = new SorobanRpc.Server(serverUrl);

const tokenContractAddress = "CDQ56Q2MGOI53XVQMARVHFWI6FVM7FG7QHAT22Q2Z7L7W5WU6IYXED4V";

async function mintToken(
    toAddress, 
    amount, 
    keypair
) {
    const tokenContract = new Contract(tokenContractAddress); 

    const toScAddress = xdr.ScVal.scvAddress(new Address(toAddress).toScAddress());
    const amountScVal = xdr.ScVal.scvI128(new xdr.Int128Parts({
        lo: xdr.Uint64.fromString(amount.toString()),
        hi: xdr.Int64.fromString('0')
    }));

    const mintOperation = tokenContract.call("mint", toScAddress, amountScVal);

    const sourceAccount = await server.getAccount(keypair.publicKey());
    const transaction = new TransactionBuilder(sourceAccount, {
        fee: '100',
        networkPassphrase: Networks.TESTNET
    })
        .addOperation(mintOperation)
        .setTimeout(30)
        .build();

    transaction.sign(keypair);
    const response = await server.sendTransaction(transaction);
    console.log(`Transaction hash: ${response.hash}`);
}

const secretKey = 'SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN';
const senderKeypair = Keypair.fromSecret(secretKey);
mintToken (senderKeypair.publicKey(),BigInt(1000),senderKeypair);