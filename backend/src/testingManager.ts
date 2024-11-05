import {
    Contract, TransactionBuilder,
    Networks, Keypair, SorobanRpc,
    Address, xdr, Operation,
    Transaction, nativeToScVal,
    MemoType,
    Memo,
    scValToNative
} from "@stellar/stellar-sdk";
import Server from '@stellar/stellar-sdk';


const contractInteract = async (method: string, admin: string, fungible: string, borrow: string) => {
    try {
        const keypair = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
        const caller = keypair.publicKey();
        const provider = new SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
        const source = await provider.getAccount(caller);
        const tokenContractAddress = "CCA7673FXGILSKO4RIJTJ6ZYGRNOAOMSMFBUGDFE6OTSENWQCN3E5G5I";
        const tokenContract = new Contract(tokenContractAddress);

        const contractAddress = "CBPGXEUBU4MOR6ALMWHRNK2QYYZI6CWSP6ESOKEHO35PTERUQEYUVSDA";
        const contract = new Contract(contractAddress);

        let buildInitialiseTx = new TransactionBuilder(source, {
            fee: '100',
            networkPassphrase: Networks.TESTNET
        }).addOperation(contract.call(method, nativeToScVal(Address.fromString(admin)), nativeToScVal(Address.fromString(fungible)))).setTimeout(30).build();

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

                    let returnValue = (transactionMeta as any).v3().sorobanMeta().returnValue();
                    console.log(`Transaction result: ${returnValue.value()}`);
                } else {
                    throw `Transaction failed: ${getResponse.resultXdr}`;
                }
            } else {
                throw (sendResponse as any).errorResultXdr;
            }
        } catch (err) {
            // Catch and report any errors we've thrown
            console.log("Sending transaction failed");
            console.log(err);
            console.log(JSON.stringify(err));
        }


    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
}

const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org", { allowHttp: true });
// const sourceAccount = 

const tokenContractId = "CC4L2PJJ2PI2SSGW2IBC44TRITUBBUPSP665JQ57D2HKN7RRNXEVCXLQ";
const tokenContract = new Contract(tokenContractId);
const networkPassphrase = Networks.TESTNET;

console.log(networkPassphrase);

async function submitTransaction(transaction: Transaction, sourceAddress: string): Promise<void> {
    const sourceKeypair = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
    if (sourceKeypair.publicKey() !== sourceAddress) {
        throw new Error("Source address does not match the provided secret key");
    }

    transaction.sign(sourceKeypair);

    try {
        const sendResponse = await server.sendTransaction(transaction);
        console.log('Transaction sent:', sendResponse);

        const transactionResponse = await server.getTransaction(sendResponse.hash);
        console.log("Transactions Response: ", sendResponse);

        if (transactionResponse.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
            console.log('Transaction successful:', transactionResponse);
        } else {
            throw new Error(`Transaction failed: ${transactionResponse.status}`);
        }
    } catch (error) {
        console.error('Error submitting transaction:', error);
        throw error;
    }
}


async function setAllowance(to: string, spender: string, amount: bigint): Promise<void> {
    // ... (similar setup code as in the mint function) ...
    const keypair = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
    const caller = keypair.publicKey();
    const provider = new SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
    // const provider = new Server('https://horizon-testnet.stellar.org', Networks.TESTNET);
    const source = await provider.getAccount(caller);
    const tokenContractAddress = "CDQ56Q2MGOI53XVQMARVHFWI6FVM7FG7QHAT22Q2Z7L7W5WU6IYXED4V";
    const tokenContract = new Contract(tokenContractAddress);

    const ledger = await provider.getLatestLedger()


    const scTo = xdr.ScVal.scvAddress(new Address(caller).toScAddress());
    const scSpender = xdr.ScVal.scvAddress(new Address(spender).toScAddress());
    const scAmount = xdr.ScVal.scvI128(new xdr.Int128Parts({
        lo: xdr.Uint64.fromString(amount.toString()),
        hi: xdr.Int64.fromString('0')
    }));
    const expiration_ledger = xdr.ScVal.scvU32(ledger.sequence + 2);

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

    let buildAllowanceTx = new TransactionBuilder(source, {
        fee: '100',
        networkPassphrase: Networks.TESTNET
    })
        .addOperation(tokenContract.call("approve", scTo, scSpender, scAmount, expiration_ledger))
        .setTimeout(30).build()

    // ... (rest of the function similar to mint, including signing and sending the transaction) ...

    let prepareTx = await provider.prepareTransaction(buildAllowanceTx);
    const signedTx = prepareTx.sign(keypair);
    console.log('signedTx',signedTx)

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

                let returnValue = (transactionMeta as any).v3().sorobanMeta().returnValue();
                console.log(`Transaction result: ${returnValue.value()}`);
            } else {
                throw `Transaction failed: ${getResponse.resultXdr}`;
            }
        } else {
            throw (sendResponse as any).errorResultXdr;
        }
    } catch (err) {
        // Catch and report any errors we've thrown
        console.log("Sending transaction failed");
        console.log(err);
        console.log(JSON.stringify(err));
    }
}

async function mint(to: string, amount: bigint): Promise<void> {
    console.log("enter mint")
    const keypair = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
    const caller = keypair.publicKey();
    const provider = new SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
    const source = await provider.getAccount(caller);
    const tokenContractAddress = "CDQ56Q2MGOI53XVQMARVHFWI6FVM7FG7QHAT22Q2Z7L7W5WU6IYXED4V";
    const tokenContract = new Contract(tokenContractAddress);

    const scTo = xdr.ScVal.scvAddress(new Address(to).toScAddress());
    const scAmount = xdr.ScVal.scvI128(new xdr.Int128Parts({
        lo: xdr.Uint64.fromString(amount.toString()),
        hi: xdr.Int64.fromString('0')
    }));
    const spender = xdr.ScVal.scvAddress(new Address("CBPGXEUBU4MOR6ALMWHRNK2QYYZI6CWSP6ESOKEHO35PTERUQEYUVSDA").toScAddress())
    const expiration_ledger = xdr.ScVal.scvU32(0);
    console.log(scTo, scAmount);

    let buildInitialiseTx = new TransactionBuilder(source, {
        fee: '100',
        networkPassphrase: Networks.TESTNET
    })
        .addOperation(tokenContract.call("mint", scTo, scAmount))
        // .addOperation(tokenContract.call("write_allowance", scTo, spender, scAmount, expiration_ledger))
        .setTimeout(30).build()



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

                let returnValue = (transactionMeta as any).v3().sorobanMeta().returnValue();
                console.log(`Transaction result: ${returnValue.value()}`);
            } else {
                throw `Transaction failed: ${getResponse.resultXdr}`;
            }
        } else {
            throw (sendResponse as any).errorResultXdr;
        }
    } catch (err) {
        // Catch and report any errors we've thrown
        console.log("Sending transaction failed");
        console.log(err);
        console.log(JSON.stringify(err));
    }

    console.log(`Minted ${amount} tokens to ${to}`);
}

async function buildTransaction(method: string, admin: string, decimal: number, name: string, symbol: string): Promise<Transaction> {
    const sourcePublicKey = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN").publicKey();
    const account = await server.getAccount(sourcePublicKey);
    const keypair = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
    const caller = keypair.publicKey();
    const provider = new SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
    const source = await provider.getAccount(caller);

    let tb = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: networkPassphrase
    }).addOperation(tokenContract.call(method, nativeToScVal(Address.fromString(admin)), nativeToScVal(decimal), nativeToScVal(name), nativeToScVal(symbol))).setTimeout(30);
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
    } catch (err) {
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

async function initializeToken(
    admin: string,
    decimal: number,
    name: string,
    symbol: string
): Promise<void> {
    const scAdmin = xdr.ScVal.scvAddress(new Address(admin).toScAddress());
    const scDecimal = xdr.ScVal.scvU32(decimal);
    const scName = xdr.ScVal.scvString(name);
    const scSymbol = xdr.ScVal.scvString(symbol);

    const tx = await buildTransaction("initialize", admin, decimal, name, symbol);

    // const initializerAddress = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN").publicKey();
    console.log(tx);
    // await submitTransaction(tx, initializerAddress);

    console.log(`Token initialized with admin: ${admin}, decimal: ${decimal}, name: ${name}, symbol: ${symbol}`);
}

async function callMint(recipientAddress: string, amount: bigint) {
    try {
        await mint(recipientAddress, amount);
        console.log(`Successfully minted ${amount} tokens to ${recipientAddress}`);
    } catch (error) {
        console.error('Error minting tokens:', error);
    }
}

// Usage example
async function main() {
    const scAdmin = xdr.ScVal.scvAddress(new Address("GCYLJJAPJMRUGM2L7SSRQ3MNFRGL3JO6WPCBU75SEXGSL6RAXBFN7SZI").toScAddress());
    const scDecimal = xdr.ScVal.scvU32(8);
    const scName = xdr.ScVal.scvString("usdc");
    const scSymbol = xdr.ScVal.scvString("USDC");
    const token = xdr.ScVal.scvAddress(new Address("CCA7673FXGILSKO4RIJTJ6ZYGRNOAOMSMFBUGDFE6OTSENWQCN3E5G5I").toScAddress());

    // contractInteract("initialize", "GCYLJJAPJMRUGM2L7SSRQ3MNFRGL3JO6WPCBU75SEXGSL6RAXBFN7SZI", "CCA7673FXGILSKO4RIJTJ6ZYGRNOAOMSMFBUGDFE6OTSENWQCN3E5G5I", "CCA7673FXGILSKO4RIJTJ6ZYGRNOAOMSMFBUGDFE6OTSENWQCN3E5G5I");


    const adminAddress = "GCYLJJAPJMRUGM2L7SSRQ3MNFRGL3JO6WPCBU75SEXGSL6RAXBFN7SZI";
    const decimal = 6;
    const name = "usdc";
    const symbol = "USDC";

    // await initializeToken(adminAddress, decimal, name, symbol);

    const recipientAddress = 'GBULU7WLCY7XX3E6J2A4YZHTXDIZL7BTV5TDF3L6N3FTDMKTGI4ODVCP'; // Replace with the actual recipient address
    const amountToMint = BigInt(1000); // Mint 1000 tokens
    // await callMint(recipientAddress, amountToMint);

    await setAllowance(recipientAddress, "CBPGXEUBU4MOR6ALMWHRNK2QYYZI6CWSP6ESOKEHO35PTERUQEYUVSDA", amountToMint)
}

const transferFrom = async (from: string, to: string, amount: bigint) => {
    try {
        const keypair = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
        const caller = keypair.publicKey();
        const provider = new SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
        const source = await provider.getAccount(caller);
        const tokenContractAddress = "CDQ56Q2MGOI53XVQMARVHFWI6FVM7FG7QHAT22Q2Z7L7W5WU6IYXED4V";
        const tokenContract = new Contract(tokenContractAddress);

        const spender =  xdr.ScVal.scvAddress(new Address(caller).toScAddress());
        const to =  xdr.ScVal.scvAddress(new Address(caller).toScAddress());

        let buildAllowanceTx = new TransactionBuilder(source, {
            fee: '100',
            networkPassphrase: Networks.TESTNET
        })
            .addOperation(tokenContract.call("transfer_from",spender,spender, to, xdr.ScVal.scvI128(new xdr.Int128Parts({
                lo: xdr.Uint64.fromString((BigInt(100)).toString()),
                hi: xdr.Int64.fromString('0')
            }))) )
            .setTimeout(30).build()

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
    
                    let returnValue = (transactionMeta as any).v3().sorobanMeta().returnValue();
                    console.log(`Transaction result: ${returnValue.value()}`);
                } else {
                    throw `Transaction failed: ${getResponse.resultXdr}`;
                }
            } else {
                throw (sendResponse as any).errorResultXdr;
            }
        } catch (err) {
            // Catch and report any errors we've thrown
            console.log("Sending transaction failed");
            console.log(err);
            console.log(JSON.stringify(err));
        }

    } catch (error) {
        console.log("Error: ", error)
    }
}

const deposit_collateral = async ( user:string, amount: bigint) => {
    try {
        const keypair = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
        const caller = keypair.publicKey();
        const provider = new SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
        const source = await provider.getAccount(caller);
        const tokenContractAddress = "CDQ56Q2MGOI53XVQMARVHFWI6FVM7FG7QHAT22Q2Z7L7W5WU6IYXED4V";
        const contractAddress = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY";
        const contract = new Contract(contractAddress);
        const token =  xdr.ScVal.scvAddress(new Address(tokenContractAddress).toScAddress());
        const new_user =  xdr.ScVal.scvAddress(new Address(user).toScAddress());


        let buildTransaction = new TransactionBuilder(source, {
            fee: '100',
            networkPassphrase: Networks.TESTNET
        }).addOperation(contract.call("deposit", token, xdr.ScVal.scvI128(new xdr.Int128Parts({
            lo: xdr.Uint64.fromString(amount.toString()),
            hi: xdr.Int64.fromString('0')
        })), new_user)).setTimeout(30).build()

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

                    let returnValue = (transactionMeta as any).v3().sorobanMeta().returnValue();
                    console.log(`Transaction result: ${returnValue.value()}`);
                } else {
                    throw `Transaction failed: ${getResponse.resultXdr}`;
                }
            } else {
                console.log(sendResponse)
                throw (sendResponse as any).errorResultXdr;
            }
        } catch (err) {
            // Catch and report any errors we've thrown
            console.log("Sending transaction failed");
            console.log(err);
            console.log(JSON.stringify(err));
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

const withdraw_collateral = async ( user:string, amount: bigint) => {
try {
    const keypair = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
    const caller = keypair.publicKey();
    const provider = new SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
    const source = await provider.getAccount(caller);
    const contractAddress = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY";
    const contract = new Contract(contractAddress);
    const new_user =  xdr.ScVal.scvAddress(new Address(user).toScAddress());


    let buildTransaction = new TransactionBuilder(source, {
        fee: '100',
        networkPassphrase: Networks.TESTNET
    }).addOperation(contract.call("withdraw_token", new_user, xdr.ScVal.scvI128(new xdr.Int128Parts({
        lo: xdr.Uint64.fromString(amount.toString()),
        hi: xdr.Int64.fromString('0')
    })))).setTimeout(30).build()

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

                let returnValue = (transactionMeta as any).v3().sorobanMeta().returnValue();
                console.log(`Transaction result: ${returnValue.value()}`);
            } else {
                throw `Transaction failed: ${getResponse.resultXdr}`;
            }
        } else {
            console.log(sendResponse)
            throw (sendResponse as any).errorResultXdr;
        }
    } catch (err) {
        // Catch and report any errors we've thrown
        console.log("Sending transaction failed");
        console.log(err);
            console.log(JSON.stringify(err));
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

const borrow = async (user:string, amount: bigint) => {
try {
    const keypair = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
    const caller = keypair.publicKey();
    const provider = new SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
    const source = await provider.getAccount(caller);
    const contractAddress = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY";
    const contract = new Contract(contractAddress);
    const new_user =  xdr.ScVal.scvAddress(new Address(user).toScAddress());


    let buildTransaction = new TransactionBuilder(source, {
        fee: '100',
        networkPassphrase: Networks.TESTNET
    }).addOperation(contract.call("borrow_token", new_user, xdr.ScVal.scvI128(new xdr.Int128Parts({
        lo: xdr.Uint64.fromString(amount.toString()),
        hi: xdr.Int64.fromString('0')
    })))).setTimeout(30).build()

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

                let returnValue = (transactionMeta as any).v3().sorobanMeta().returnValue();
                console.log(`Transaction result: ${returnValue.value()}`);
            } else {
                throw `Transaction failed: ${getResponse.resultXdr}`;
            }
        } else {
            console.log(sendResponse)
            throw (sendResponse as any).errorResultXdr;
        }
    } catch (err) {
        // Catch and report any errors we've thrown
        console.log("Sending transaction failed");
        console.log(err);
            console.log(JSON.stringify(err));
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}


const repay = async (user:string, amount: bigint) => {
    try {
        const keypair = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
        const caller = keypair.publicKey();
        const provider = new SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
        const source = await provider.getAccount(caller);
        const contractAddress = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY";
        const contract = new Contract(contractAddress);
        const new_user =  xdr.ScVal.scvAddress(new Address(user).toScAddress());
    
    
        let buildTransaction = new TransactionBuilder(source, {
            fee: '100',
            networkPassphrase: Networks.TESTNET
        }).addOperation(contract.call("repay_token", new_user, xdr.ScVal.scvI128(new xdr.Int128Parts({
            lo: xdr.Uint64.fromString(amount.toString()),
            hi: xdr.Int64.fromString('0')
        })))).setTimeout(30).build()
    
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
    
                    let returnValue = (transactionMeta as any).v3().sorobanMeta().returnValue();
                    console.log(`Transaction result: ${returnValue.value()}`);
                } else {
                    throw `Transaction failed: ${getResponse.resultXdr}`;
                }
            } else {
                console.log(sendResponse)
                throw (sendResponse as any).errorResultXdr;
            }
        } catch (err) {
            // Catch and report any errors we've thrown
            console.log("Sending transaction failed");
            console.log(err);
                console.log(JSON.stringify(err));
            }
        } catch (error) {
            console.log("Error: ", error);
        }
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

const getter = async (user:string) => {
 try {
    const keypair = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
    const caller = keypair.publicKey();
    const provider = new SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
    const source = await provider.getAccount(caller);
    const contractAddress = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY";
    const contract = new Contract(contractAddress);
    const new_user =  xdr.ScVal.scvAddress(new Address(user).toScAddress());

    const tx = new TransactionBuilder(source, {
        fee: '100',
        networkPassphrase: Networks.TESTNET
    }).addOperation(contract.call("get_user_balance", new_user)).setTimeout(30).build();
    
    const result = await simulateTx(tx, provider)
    console.log(result)
 } catch (error) {
    console.log(error)
 }
}

async function run() {
    console.log("Hello World");
    // deposit_collateral();
    const me = "GCQGUDCA2KV2EZDOVCMYTQNOCPZZ34UEC6DHSUXSZCU2FLQKGIQEPJZ2";
    const somya = "GCYLJJAPJMRUGM2L7SSRQ3MNFRGL3JO6WPCBU75SEXGSL6RAXBFN7SZI";
    const contract = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY"
    const testUser = "GBLBJD5KYVUFCJ7FAGEABF4HZ5YVRR7OO2IWR6URQOX447II3J2AFG5X"
    // await mint(testUser, BigInt(1000));
    // await setAllowance(testUser, contract, BigInt(1000));
    await getter(testUser)
    // await deposit_collateral(testUser, BigInt(1000)) 
    // await transferFrom("","",BigInt(0))
    // await withdraw_collateral(somya, BigInt(100))
    // await borrow(somya, BigInt(100))
    // await repay(somya, BigInt(100))

    
}

run()


// private key - user send tx 
