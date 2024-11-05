"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateTx = void 0;
const stellar_sdk_1 = require("@stellar/stellar-sdk");
const contractInteract = async (method, admin, fungible, borrow) => {
    try {
        const keypair = stellar_sdk_1.Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
        const caller = keypair.publicKey();
        const provider = new stellar_sdk_1.SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
        const source = await provider.getAccount(caller);
        const tokenContractAddress = "CCA7673FXGILSKO4RIJTJ6ZYGRNOAOMSMFBUGDFE6OTSENWQCN3E5G5I";
        const tokenContract = new stellar_sdk_1.Contract(tokenContractAddress);
        const contractAddress = "CBPGXEUBU4MOR6ALMWHRNK2QYYZI6CWSP6ESOKEHO35PTERUQEYUVSDA";
        const contract = new stellar_sdk_1.Contract(contractAddress);
        let buildInitialiseTx = new stellar_sdk_1.TransactionBuilder(source, {
            fee: '100',
            networkPassphrase: stellar_sdk_1.Networks.TESTNET
        }).addOperation(contract.call(method, (0, stellar_sdk_1.nativeToScVal)(stellar_sdk_1.Address.fromString(admin)), (0, stellar_sdk_1.nativeToScVal)(stellar_sdk_1.Address.fromString(fungible)))).setTimeout(30).build();
        let prepareTx = await provider.prepareTransaction(buildInitialiseTx);
        prepareTx.sign(keypair);
        try {
            let sendResponse = await provider.sendTransaction(prepareTx);
            console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);
            if (sendResponse.status === "PENDING") {
                let getResponse = await provider.getTransaction(sendResponse.hash);
                // Poll `getTransaction` until the status is not "NOT_FOUND"
                while (getResponse.status === "NOT_FOUND") {
                    console.log("Waiting for transaction confirmation...");
                    // See if the transaction is complete
                    getResponse = await provider.getTransaction(sendResponse.hash);
                    // Wait one second
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                console.log(`getTransaction response: ${JSON.stringify(getResponse)}`);
                if (getResponse.status === "SUCCESS") {
                    // Make sure the transaction's resultMetaXDR is not empty
                    if (!getResponse.resultMetaXdr) {
                        throw "Empty resultMetaXDR in getTransaction response";
                    }
                    // Find the return value from the contract and return it
                    let transactionMeta = getResponse.resultMetaXdr;
                    let returnValue = transactionMeta.v3().sorobanMeta().returnValue();
                    console.log(`Transaction result: ${returnValue.value()}`);
                }
                else {
                    throw `Transaction failed: ${getResponse.resultXdr}`;
                }
            }
            else {
                throw sendResponse.errorResultXdr;
            }
        }
        catch (err) {
            // Catch and report any errors we've thrown
            console.log("Sending transaction failed");
            console.log(err);
            console.log(JSON.stringify(err));
        }
    }
    catch (error) {
        console.error('Error: ', error);
        throw error;
    }
};
const server = new stellar_sdk_1.SorobanRpc.Server("https://soroban-testnet.stellar.org", { allowHttp: true });
// const sourceAccount = 
const tokenContractId = "CC4L2PJJ2PI2SSGW2IBC44TRITUBBUPSP665JQ57D2HKN7RRNXEVCXLQ";
const tokenContract = new stellar_sdk_1.Contract(tokenContractId);
const networkPassphrase = stellar_sdk_1.Networks.TESTNET;
console.log(networkPassphrase);
async function submitTransaction(transaction, sourceAddress) {
    const sourceKeypair = stellar_sdk_1.Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
    if (sourceKeypair.publicKey() !== sourceAddress) {
        throw new Error("Source address does not match the provided secret key");
    }
    transaction.sign(sourceKeypair);
    try {
        const sendResponse = await server.sendTransaction(transaction);
        console.log('Transaction sent:', sendResponse);
        const transactionResponse = await server.getTransaction(sendResponse.hash);
        console.log("Transactions Response: ", sendResponse);
        if (transactionResponse.status === stellar_sdk_1.SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
            console.log('Transaction successful:', transactionResponse);
        }
        else {
            throw new Error(`Transaction failed: ${transactionResponse.status}`);
        }
    }
    catch (error) {
        console.error('Error submitting transaction:', error);
        throw error;
    }
}
async function setAllowance(to, spender, amount) {
    // ... (similar setup code as in the mint function) ...
    const keypair = stellar_sdk_1.Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
    const caller = keypair.publicKey();
    const provider = new stellar_sdk_1.SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
    // const provider = new Server('https://horizon-testnet.stellar.org', Networks.TESTNET);
    const source = await provider.getAccount(caller);
    const tokenContractAddress = "CDQ56Q2MGOI53XVQMARVHFWI6FVM7FG7QHAT22Q2Z7L7W5WU6IYXED4V";
    const tokenContract = new stellar_sdk_1.Contract(tokenContractAddress);
    const ledger = await provider.getLatestLedger();
    const scTo = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(caller).toScAddress());
    const scSpender = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(spender).toScAddress());
    const scAmount = stellar_sdk_1.xdr.ScVal.scvI128(new stellar_sdk_1.xdr.Int128Parts({
        lo: stellar_sdk_1.xdr.Uint64.fromString(amount.toString()),
        hi: stellar_sdk_1.xdr.Int64.fromString('0')
    }));
    const expiration_ledger = stellar_sdk_1.xdr.ScVal.scvU32(ledger.sequence + 2);
    // let view = new TransactionBuilder(source, {
    //     fee: '100',
    //     networkPassphrase: Networks.TESTNET
    // }).addOperation(tokenContract.call("balance", scTo)).setTimeout(30).build();
    // const simulationResponse = await server.simulateTransaction(view);
    // if ('result' in simulationResponse) {
    //     console.log(simulationResponse)
    // } else {
    //     throw new Error(`Simulation failed: ${JSON.stringify(simulationResponse)}`);
    // }
    let buildAllowanceTx = new stellar_sdk_1.TransactionBuilder(source, {
        fee: '100',
        networkPassphrase: stellar_sdk_1.Networks.TESTNET
    })
        .addOperation(tokenContract.call("approve", scTo, scSpender, scAmount, expiration_ledger))
        .setTimeout(30).build();
    // ... (rest of the function similar to mint, including signing and sending the transaction) ...
    let prepareTx = await provider.prepareTransaction(buildAllowanceTx);
    const signedTx = prepareTx.sign(keypair);
    console.log('signedTx', signedTx);
    try {
        let sendResponse = await provider.sendTransaction(prepareTx);
        console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);
        if (sendResponse.status === "PENDING") {
            let getResponse = await provider.getTransaction(sendResponse.hash);
            // Poll `getTransaction` until the status is not "NOT_FOUND"
            while (getResponse.status === "NOT_FOUND") {
                console.log("Waiting for transaction confirmation...");
                // See if the transaction is complete
                getResponse = await provider.getTransaction(sendResponse.hash);
                // Wait one second
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            console.log(`getTransaction response: ${JSON.stringify(getResponse)}`);
            if (getResponse.status === "SUCCESS") {
                // Make sure the transaction's resultMetaXDR is not empty
                if (!getResponse.resultMetaXdr) {
                    throw "Empty resultMetaXDR in getTransaction response";
                }
                // Find the return value from the contract and return it
                let transactionMeta = getResponse.resultMetaXdr;
                let returnValue = transactionMeta.v3().sorobanMeta().returnValue();
                console.log(`Transaction result: ${returnValue.value()}`);
            }
            else {
                throw `Transaction failed: ${getResponse.resultXdr}`;
            }
        }
        else {
            throw sendResponse.errorResultXdr;
        }
    }
    catch (err) {
        // Catch and report any errors we've thrown
        console.log("Sending transaction failed");
        console.log(err);
        console.log(JSON.stringify(err));
    }
}
async function mint(to, amount) {
    console.log("enter mint");
    const keypair = stellar_sdk_1.Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
    const caller = keypair.publicKey();
    const provider = new stellar_sdk_1.SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
    const source = await provider.getAccount(caller);
    const tokenContractAddress = "CDQ56Q2MGOI53XVQMARVHFWI6FVM7FG7QHAT22Q2Z7L7W5WU6IYXED4V";
    const tokenContract = new stellar_sdk_1.Contract(tokenContractAddress);
    const scTo = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(to).toScAddress());
    const scAmount = stellar_sdk_1.xdr.ScVal.scvI128(new stellar_sdk_1.xdr.Int128Parts({
        lo: stellar_sdk_1.xdr.Uint64.fromString(amount.toString()),
        hi: stellar_sdk_1.xdr.Int64.fromString('0')
    }));
    const spender = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address("CBPGXEUBU4MOR6ALMWHRNK2QYYZI6CWSP6ESOKEHO35PTERUQEYUVSDA").toScAddress());
    const expiration_ledger = stellar_sdk_1.xdr.ScVal.scvU32(0);
    console.log(scTo, scAmount);
    let buildInitialiseTx = new stellar_sdk_1.TransactionBuilder(source, {
        fee: '100',
        networkPassphrase: stellar_sdk_1.Networks.TESTNET
    })
        .addOperation(tokenContract.call("mint", scTo, scAmount))
        // .addOperation(tokenContract.call("write_allowance", scTo, spender, scAmount, expiration_ledger))
        .setTimeout(30).build();
    let prepareTx = await provider.prepareTransaction(buildInitialiseTx);
    prepareTx.sign(keypair);
    try {
        let sendResponse = await provider.sendTransaction(prepareTx);
        console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);
        if (sendResponse.status === "PENDING") {
            let getResponse = await provider.getTransaction(sendResponse.hash);
            // Poll `getTransaction` until the status is not "NOT_FOUND"
            while (getResponse.status === "NOT_FOUND") {
                console.log("Waiting for transaction confirmation...");
                // See if the transaction is complete
                getResponse = await provider.getTransaction(sendResponse.hash);
                // Wait one second
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            console.log(`getTransaction response: ${JSON.stringify(getResponse)}`);
            if (getResponse.status === "SUCCESS") {
                // Make sure the transaction's resultMetaXDR is not empty
                if (!getResponse.resultMetaXdr) {
                    throw "Empty resultMetaXDR in getTransaction response";
                }
                // Find the return value from the contract and return it
                let transactionMeta = getResponse.resultMetaXdr;
                let returnValue = transactionMeta.v3().sorobanMeta().returnValue();
                console.log(`Transaction result: ${returnValue.value()}`);
            }
            else {
                throw `Transaction failed: ${getResponse.resultXdr}`;
            }
        }
        else {
            throw sendResponse.errorResultXdr;
        }
    }
    catch (err) {
        // Catch and report any errors we've thrown
        console.log("Sending transaction failed");
        console.log(err);
        console.log(JSON.stringify(err));
    }
    console.log(`Minted ${amount} tokens to ${to}`);
}
async function buildTransaction(method, admin, decimal, name, symbol) {
    const sourcePublicKey = stellar_sdk_1.Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN").publicKey();
    const account = await server.getAccount(sourcePublicKey);
    const keypair = stellar_sdk_1.Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
    const caller = keypair.publicKey();
    const provider = new stellar_sdk_1.SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
    const source = await provider.getAccount(caller);
    let tb = new stellar_sdk_1.TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: networkPassphrase
    }).addOperation(tokenContract.call(method, (0, stellar_sdk_1.nativeToScVal)(stellar_sdk_1.Address.fromString(admin)), (0, stellar_sdk_1.nativeToScVal)(decimal), (0, stellar_sdk_1.nativeToScVal)(name), (0, stellar_sdk_1.nativeToScVal)(symbol))).setTimeout(30);
    let transaction = tb.build();
    let prepareTx = await provider.prepareTransaction(transaction);
    prepareTx.sign(keypair);
    try {
        let sendResponse = await provider.sendTransaction(prepareTx);
        console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);
        // if (sendResponse.status === "PENDING") {
        //     let getResponse = await provider.getTransaction(sendResponse.hash);
        //     // Poll `getTransaction` until the status is not "NOT_FOUND"
        //     while (getResponse.status === "NOT_FOUND") {
        //         console.log("Waiting for transaction confirmation...");
        //         // See if the transaction is complete
        //         getResponse = await provider.getTransaction(sendResponse.hash);
        //         // Wait one second
        //         await new Promise((resolve) => setTimeout(resolve, 1000));
        //     }
        //     console.log(`getTransaction response: ${JSON.stringify(getResponse)}`);
        //     if (getResponse.status === "SUCCESS") {
        //         // Make sure the transaction's resultMetaXDR is not empty
        //         if (!getResponse.resultMetaXdr) {
        //             throw "Empty resultMetaXDR in getTransaction response";
        //         }
        //         // Find the return value from the contract and return it
        //         let transactionMeta = getResponse.resultMetaXdr;
        //         let returnValue = (transactionMeta as any).v3().sorobanMeta().returnValue();
        //         console.log(`Transaction result: ${returnValue.value()}`);
        //     } else {
        //         throw `Transaction failed: ${getResponse.resultXdr}`;
        //     }
        // } else {
        //     throw (sendResponse as any).errorResultXdr;
        // }
    }
    catch (err) {
        // Catch and report any errors we've thrown
        console.log("Sending transaction failed");
        console.log(err);
        console.log(JSON.stringify(err));
    }
    // const simulation = await server.simulateTransaction(transaction);
    // if ('error' in simulation) {
    //     throw new Error(`Transaction simulation failed: ${simulation.error}`);
    // }
    return transaction;
}
async function initializeToken(admin, decimal, name, symbol) {
    const scAdmin = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(admin).toScAddress());
    const scDecimal = stellar_sdk_1.xdr.ScVal.scvU32(decimal);
    const scName = stellar_sdk_1.xdr.ScVal.scvString(name);
    const scSymbol = stellar_sdk_1.xdr.ScVal.scvString(symbol);
    const tx = await buildTransaction("initialize", admin, decimal, name, symbol);
    // const initializerAddress = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN").publicKey();
    console.log(tx);
    // await submitTransaction(tx, initializerAddress);
    console.log(`Token initialized with admin: ${admin}, decimal: ${decimal}, name: ${name}, symbol: ${symbol}`);
}
async function callMint(recipientAddress, amount) {
    try {
        await mint(recipientAddress, amount);
        console.log(`Successfully minted ${amount} tokens to ${recipientAddress}`);
    }
    catch (error) {
        console.error('Error minting tokens:', error);
    }
}
// Usage example
async function main() {
    const scAdmin = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address("GCYLJJAPJMRUGM2L7SSRQ3MNFRGL3JO6WPCBU75SEXGSL6RAXBFN7SZI").toScAddress());
    const scDecimal = stellar_sdk_1.xdr.ScVal.scvU32(8);
    const scName = stellar_sdk_1.xdr.ScVal.scvString("usdc");
    const scSymbol = stellar_sdk_1.xdr.ScVal.scvString("USDC");
    const token = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address("CCA7673FXGILSKO4RIJTJ6ZYGRNOAOMSMFBUGDFE6OTSENWQCN3E5G5I").toScAddress());
    // contractInteract("initialize", "GCYLJJAPJMRUGM2L7SSRQ3MNFRGL3JO6WPCBU75SEXGSL6RAXBFN7SZI", "CCA7673FXGILSKO4RIJTJ6ZYGRNOAOMSMFBUGDFE6OTSENWQCN3E5G5I", "CCA7673FXGILSKO4RIJTJ6ZYGRNOAOMSMFBUGDFE6OTSENWQCN3E5G5I");
    const adminAddress = "GCYLJJAPJMRUGM2L7SSRQ3MNFRGL3JO6WPCBU75SEXGSL6RAXBFN7SZI";
    const decimal = 6;
    const name = "usdc";
    const symbol = "USDC";
    // await initializeToken(adminAddress, decimal, name, symbol);
    const recipientAddress = 'GBULU7WLCY7XX3E6J2A4YZHTXDIZL7BTV5TDF3L6N3FTDMKTGI4ODVCP'; // Replace with the actual recipient address
    const amountToMint = BigInt(1000); // Mint 1000 tokens
    // await callMint(recipientAddress, amountToMint);
    await setAllowance(recipientAddress, "CBPGXEUBU4MOR6ALMWHRNK2QYYZI6CWSP6ESOKEHO35PTERUQEYUVSDA", amountToMint);
}
const transferFrom = async (from, to, amount) => {
    try {
        const keypair = stellar_sdk_1.Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
        const caller = keypair.publicKey();
        const provider = new stellar_sdk_1.SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
        const source = await provider.getAccount(caller);
        const tokenContractAddress = "CDQ56Q2MGOI53XVQMARVHFWI6FVM7FG7QHAT22Q2Z7L7W5WU6IYXED4V";
        const tokenContract = new stellar_sdk_1.Contract(tokenContractAddress);
        const spender = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(caller).toScAddress());
        const to = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(caller).toScAddress());
        let buildAllowanceTx = new stellar_sdk_1.TransactionBuilder(source, {
            fee: '100',
            networkPassphrase: stellar_sdk_1.Networks.TESTNET
        })
            .addOperation(tokenContract.call("transfer_from", spender, spender, to, stellar_sdk_1.xdr.ScVal.scvI128(new stellar_sdk_1.xdr.Int128Parts({
            lo: stellar_sdk_1.xdr.Uint64.fromString((BigInt(100)).toString()),
            hi: stellar_sdk_1.xdr.Int64.fromString('0')
        }))))
            .setTimeout(30).build();
        let prepareTx = await provider.prepareTransaction(buildAllowanceTx);
        const signedTx = prepareTx.sign(keypair);
        try {
            let sendResponse = await provider.sendTransaction(prepareTx);
            console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);
            if (sendResponse.status === "PENDING") {
                let getResponse = await provider.getTransaction(sendResponse.hash);
                // Poll `getTransaction` until the status is not "NOT_FOUND"
                while (getResponse.status === "NOT_FOUND") {
                    console.log("Waiting for transaction confirmation...");
                    // See if the transaction is complete
                    getResponse = await provider.getTransaction(sendResponse.hash);
                    // Wait one second
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                console.log(`getTransaction response: ${JSON.stringify(getResponse)}`);
                if (getResponse.status === "SUCCESS") {
                    // Make sure the transaction's resultMetaXDR is not empty
                    if (!getResponse.resultMetaXdr) {
                        throw "Empty resultMetaXDR in getTransaction response";
                    }
                    // Find the return value from the contract and return it
                    let transactionMeta = getResponse.resultMetaXdr;
                    let returnValue = transactionMeta.v3().sorobanMeta().returnValue();
                    console.log(`Transaction result: ${returnValue.value()}`);
                }
                else {
                    throw `Transaction failed: ${getResponse.resultXdr}`;
                }
            }
            else {
                throw sendResponse.errorResultXdr;
            }
        }
        catch (err) {
            // Catch and report any errors we've thrown
            console.log("Sending transaction failed");
            console.log(err);
            console.log(JSON.stringify(err));
        }
    }
    catch (error) {
        console.log("Error: ", error);
    }
};
const deposit_collateral = async (user, amount) => {
    try {
        const keypair = stellar_sdk_1.Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
        const caller = keypair.publicKey();
        const provider = new stellar_sdk_1.SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
        const source = await provider.getAccount(caller);
        const tokenContractAddress = "CDQ56Q2MGOI53XVQMARVHFWI6FVM7FG7QHAT22Q2Z7L7W5WU6IYXED4V";
        const contractAddress = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY";
        const contract = new stellar_sdk_1.Contract(contractAddress);
        const token = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(tokenContractAddress).toScAddress());
        const new_user = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(user).toScAddress());
        let buildTransaction = new stellar_sdk_1.TransactionBuilder(source, {
            fee: '100',
            networkPassphrase: stellar_sdk_1.Networks.TESTNET
        }).addOperation(contract.call("deposit", token, stellar_sdk_1.xdr.ScVal.scvI128(new stellar_sdk_1.xdr.Int128Parts({
            lo: stellar_sdk_1.xdr.Uint64.fromString(amount.toString()),
            hi: stellar_sdk_1.xdr.Int64.fromString('0')
        })), new_user)).setTimeout(30).build();
        let prepareTx = await provider.prepareTransaction(buildTransaction);
        prepareTx.sign(keypair);
        try {
            let sendResponse = await provider.sendTransaction(prepareTx);
            console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);
            if (sendResponse.status === "PENDING") {
                let getResponse = await provider.getTransaction(sendResponse.hash);
                // Poll `getTransaction` until the status is not "NOT_FOUND"
                while (getResponse.status === "NOT_FOUND") {
                    console.log("Waiting for transaction confirmation...");
                    // See if the transaction is complete
                    getResponse = await provider.getTransaction(sendResponse.hash);
                    // Wait one second
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                console.log(`getTransaction response: ${JSON.stringify(getResponse)}`);
                if (getResponse.status === "SUCCESS") {
                    // Make sure the transaction's resultMetaXDR is not empty
                    if (!getResponse.resultMetaXdr) {
                        throw "Empty resultMetaXDR in getTransaction response";
                    }
                    // Find the return value from the contract and return it
                    let transactionMeta = getResponse.resultMetaXdr;
                    let returnValue = transactionMeta.v3().sorobanMeta().returnValue();
                    console.log(`Transaction result: ${returnValue.value()}`);
                }
                else {
                    throw `Transaction failed: ${getResponse.resultXdr}`;
                }
            }
            else {
                console.log(sendResponse);
                throw sendResponse.errorResultXdr;
            }
        }
        catch (err) {
            // Catch and report any errors we've thrown
            console.log("Sending transaction failed");
            console.log(err);
            console.log(JSON.stringify(err));
        }
    }
    catch (error) {
        console.log("Error: ", error);
    }
};
const withdraw_collateral = async (user, amount) => {
    try {
        const keypair = stellar_sdk_1.Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
        const caller = keypair.publicKey();
        const provider = new stellar_sdk_1.SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
        const source = await provider.getAccount(caller);
        const contractAddress = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY";
        const contract = new stellar_sdk_1.Contract(contractAddress);
        const new_user = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(user).toScAddress());
        let buildTransaction = new stellar_sdk_1.TransactionBuilder(source, {
            fee: '100',
            networkPassphrase: stellar_sdk_1.Networks.TESTNET
        }).addOperation(contract.call("withdraw_token", new_user, stellar_sdk_1.xdr.ScVal.scvI128(new stellar_sdk_1.xdr.Int128Parts({
            lo: stellar_sdk_1.xdr.Uint64.fromString(amount.toString()),
            hi: stellar_sdk_1.xdr.Int64.fromString('0')
        })))).setTimeout(30).build();
        let prepareTx = await provider.prepareTransaction(buildTransaction);
        prepareTx.sign(keypair);
        try {
            let sendResponse = await provider.sendTransaction(prepareTx);
            console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);
            if (sendResponse.status === "PENDING") {
                let getResponse = await provider.getTransaction(sendResponse.hash);
                // Poll `getTransaction` until the status is not "NOT_FOUND"
                while (getResponse.status === "NOT_FOUND") {
                    console.log("Waiting for transaction confirmation...");
                    // See if the transaction is complete
                    getResponse = await provider.getTransaction(sendResponse.hash);
                    // Wait one second
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                console.log(`getTransaction response: ${JSON.stringify(getResponse)}`);
                if (getResponse.status === "SUCCESS") {
                    // Make sure the transaction's resultMetaXDR is not empty
                    if (!getResponse.resultMetaXdr) {
                        throw "Empty resultMetaXDR in getTransaction response";
                    }
                    // Find the return value from the contract and return it
                    let transactionMeta = getResponse.resultMetaXdr;
                    let returnValue = transactionMeta.v3().sorobanMeta().returnValue();
                    console.log(`Transaction result: ${returnValue.value()}`);
                }
                else {
                    throw `Transaction failed: ${getResponse.resultXdr}`;
                }
            }
            else {
                console.log(sendResponse);
                throw sendResponse.errorResultXdr;
            }
        }
        catch (err) {
            // Catch and report any errors we've thrown
            console.log("Sending transaction failed");
            console.log(err);
            console.log(JSON.stringify(err));
        }
    }
    catch (error) {
        console.log("Error: ", error);
    }
};
const borrow = async (user, amount) => {
    try {
        const keypair = stellar_sdk_1.Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
        const caller = keypair.publicKey();
        const provider = new stellar_sdk_1.SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
        const source = await provider.getAccount(caller);
        const contractAddress = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY";
        const contract = new stellar_sdk_1.Contract(contractAddress);
        const new_user = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(user).toScAddress());
        let buildTransaction = new stellar_sdk_1.TransactionBuilder(source, {
            fee: '100',
            networkPassphrase: stellar_sdk_1.Networks.TESTNET
        }).addOperation(contract.call("borrow_token", new_user, stellar_sdk_1.xdr.ScVal.scvI128(new stellar_sdk_1.xdr.Int128Parts({
            lo: stellar_sdk_1.xdr.Uint64.fromString(amount.toString()),
            hi: stellar_sdk_1.xdr.Int64.fromString('0')
        })))).setTimeout(30).build();
        let prepareTx = await provider.prepareTransaction(buildTransaction);
        prepareTx.sign(keypair);
        try {
            let sendResponse = await provider.sendTransaction(prepareTx);
            console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);
            if (sendResponse.status === "PENDING") {
                let getResponse = await provider.getTransaction(sendResponse.hash);
                // Poll `getTransaction` until the status is not "NOT_FOUND"
                while (getResponse.status === "NOT_FOUND") {
                    console.log("Waiting for transaction confirmation...");
                    // See if the transaction is complete
                    getResponse = await provider.getTransaction(sendResponse.hash);
                    // Wait one second
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                console.log(`getTransaction response: ${JSON.stringify(getResponse)}`);
                if (getResponse.status === "SUCCESS") {
                    // Make sure the transaction's resultMetaXDR is not empty
                    if (!getResponse.resultMetaXdr) {
                        throw "Empty resultMetaXDR in getTransaction response";
                    }
                    // Find the return value from the contract and return it
                    let transactionMeta = getResponse.resultMetaXdr;
                    let returnValue = transactionMeta.v3().sorobanMeta().returnValue();
                    console.log(`Transaction result: ${returnValue.value()}`);
                }
                else {
                    throw `Transaction failed: ${getResponse.resultXdr}`;
                }
            }
            else {
                console.log(sendResponse);
                throw sendResponse.errorResultXdr;
            }
        }
        catch (err) {
            // Catch and report any errors we've thrown
            console.log("Sending transaction failed");
            console.log(err);
            console.log(JSON.stringify(err));
        }
    }
    catch (error) {
        console.log("Error: ", error);
    }
};
const repay = async (user, amount) => {
    try {
        const keypair = stellar_sdk_1.Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
        const caller = keypair.publicKey();
        const provider = new stellar_sdk_1.SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
        const source = await provider.getAccount(caller);
        const contractAddress = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY";
        const contract = new stellar_sdk_1.Contract(contractAddress);
        const new_user = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(user).toScAddress());
        let buildTransaction = new stellar_sdk_1.TransactionBuilder(source, {
            fee: '100',
            networkPassphrase: stellar_sdk_1.Networks.TESTNET
        }).addOperation(contract.call("repay_token", new_user, stellar_sdk_1.xdr.ScVal.scvI128(new stellar_sdk_1.xdr.Int128Parts({
            lo: stellar_sdk_1.xdr.Uint64.fromString(amount.toString()),
            hi: stellar_sdk_1.xdr.Int64.fromString('0')
        })))).setTimeout(30).build();
        let prepareTx = await provider.prepareTransaction(buildTransaction);
        prepareTx.sign(keypair);
        try {
            let sendResponse = await provider.sendTransaction(prepareTx);
            console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);
            if (sendResponse.status === "PENDING") {
                let getResponse = await provider.getTransaction(sendResponse.hash);
                // Poll `getTransaction` until the status is not "NOT_FOUND"
                while (getResponse.status === "NOT_FOUND") {
                    console.log("Waiting for transaction confirmation...");
                    // See if the transaction is complete
                    getResponse = await provider.getTransaction(sendResponse.hash);
                    // Wait one second
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                console.log(`getTransaction response: ${JSON.stringify(getResponse)}`);
                if (getResponse.status === "SUCCESS") {
                    // Make sure the transaction's resultMetaXDR is not empty
                    if (!getResponse.resultMetaXdr) {
                        throw "Empty resultMetaXDR in getTransaction response";
                    }
                    // Find the return value from the contract and return it
                    let transactionMeta = getResponse.resultMetaXdr;
                    let returnValue = transactionMeta.v3().sorobanMeta().returnValue();
                    console.log(`Transaction result: ${returnValue.value()}`);
                }
                else {
                    throw `Transaction failed: ${getResponse.resultXdr}`;
                }
            }
            else {
                console.log(sendResponse);
                throw sendResponse.errorResultXdr;
            }
        }
        catch (err) {
            // Catch and report any errors we've thrown
            console.log("Sending transaction failed");
            console.log(err);
            console.log(JSON.stringify(err));
        }
    }
    catch (error) {
        console.log("Error: ", error);
    }
};
const simulateTx = async (tx, server) => {
    const response = await server.simulateTransaction(tx);
    if (stellar_sdk_1.SorobanRpc.Api.isSimulationSuccess(response) &&
        response.result !== undefined) {
        return (0, stellar_sdk_1.scValToNative)(response.result.retval);
    }
    throw new Error("cannot simulate transaction");
};
exports.simulateTx = simulateTx;
const getter = async (user) => {
    try {
        const keypair = stellar_sdk_1.Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
        const caller = keypair.publicKey();
        const provider = new stellar_sdk_1.SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
        const source = await provider.getAccount(caller);
        const contractAddress = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY";
        const contract = new stellar_sdk_1.Contract(contractAddress);
        const new_user = stellar_sdk_1.xdr.ScVal.scvAddress(new stellar_sdk_1.Address(user).toScAddress());
        const tx = new stellar_sdk_1.TransactionBuilder(source, {
            fee: '100',
            networkPassphrase: stellar_sdk_1.Networks.TESTNET
        }).addOperation(contract.call("get_user_balance", new_user)).setTimeout(30).build();
        const result = await (0, exports.simulateTx)(tx, provider);
        console.log(result);
    }
    catch (error) {
        console.log(error);
    }
};
async function run() {
    console.log("Hello World");
    // deposit_collateral();
    const me = "GCQGUDCA2KV2EZDOVCMYTQNOCPZZ34UEC6DHSUXSZCU2FLQKGIQEPJZ2";
    const somya = "GCYLJJAPJMRUGM2L7SSRQ3MNFRGL3JO6WPCBU75SEXGSL6RAXBFN7SZI";
    const contract = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY";
    const testUser = "GBLBJD5KYVUFCJ7FAGEABF4HZ5YVRR7OO2IWR6URQOX447II3J2AFG5X";
    // await mint(testUser, BigInt(1000));
    // await setAllowance(testUser, contract, BigInt(1000));
    await getter(testUser);
    // await deposit_collateral(testUser, BigInt(1000)) 
    // await transferFrom("","",BigInt(0))
    // await withdraw_collateral(somya, BigInt(100))
    // await borrow(somya, BigInt(100))
    // await repay(somya, BigInt(100))
}
run();
// private key - user send tx 
