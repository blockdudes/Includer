import {
    Contract, TransactionBuilder,
    Networks, Keypair, SorobanRpc,
    Address, xdr, Operation,
    Transaction, nativeToScVal
} from "@stellar/stellar-sdk";
import Server from '@stellar/stellar-sdk';


const server = new SorobanRpc.Server("https://soroban-testnet.stellar.org", { allowHttp: true });


async function setAllowance(to: string, spender: string, amount: bigint): Promise<void> {
    const keypair = Keypair.fromSecret("SBOU7VP4MYLJSFFYRXV5Z2XAT62YQBUKQQA2ANBDP3P5FLBPQMRM6XJN");
    const caller = keypair.publicKey();
    const provider = new SorobanRpc.Server("https://soroban-testnet.stellar.org:443");
    const source = await provider.getAccount(caller);
    const tokenContractAddress = "CDQ56Q2MGOI53XVQMARVHFWI6FVM7FG7QHAT22Q2Z7L7W5WU6IYXED4V";
    const tokenContract = new Contract(tokenContractAddress);

    const ledger = await provider.getLatestLedger();
    const expiration_ledger = xdr.ScVal.scvU32(ledger.sequence + 2);

    const scTo = xdr.ScVal.scvAddress(new Address(caller).toScAddress());
    const scSpender = xdr.ScVal.scvAddress(new Address(spender).toScAddress());
    const scAmount = xdr.ScVal.scvI128(new xdr.Int128Parts({
        lo: xdr.Uint64.fromString(amount.toString()),
        hi: xdr.Int64.fromString('0')
    }));

    let buildAllowanceTx = new TransactionBuilder(source, {
        fee: '100',
        networkPassphrase: Networks.TESTNET
    })
        .addOperation(tokenContract.call("approve", scTo, scSpender, scAmount, expiration_ledger))
        .setTimeout(30)
        .build();

    let prepareTx = await provider.prepareTransaction(buildAllowanceTx);
    prepareTx.sign(keypair);

    try {
        let sendResponse = await provider.sendTransaction(prepareTx);
        console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);

        if (sendResponse.status === "PENDING") {
            let getResponse = await waitForTransaction(sendResponse.hash, provider);
            if (getResponse.status === "SUCCESS") {
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
        console.log("Sending transaction failed");
        console.log(err);
        console.log(JSON.stringify(err));
    }
}

async function waitForTransaction(hash: string, provider: SorobanRpc.Server): Promise<any> {
    let response = await provider.getTransaction(hash);
    let attempts = 0;
    const maxAttempts = 30;
    while (response.status === "NOT_FOUND" && attempts < maxAttempts) {
        console.log("Waiting for transaction confirmation...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        response = await provider.getTransaction(hash);
        attempts++;
    }
    if (attempts === maxAttempts) {
        throw new Error("Transaction confirmation timed out");
    }
    return response;
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

async function run() {
    console.log("Hello World");
    // deposit_collateral();
    const me = "GCQGUDCA2KV2EZDOVCMYTQNOCPZZ34UEC6DHSUXSZCU2FLQKGIQEPJZ2";
    const somya = "GCYLJJAPJMRUGM2L7SSRQ3MNFRGL3JO6WPCBU75SEXGSL6RAXBFN7SZI";
    const contract = "CAK2YJSZ35QYPHWVHPRTKPPDYD5CT5YPXCC55HHUA6NQEMZMTQX4TYWY"
    // await mint(somya, BigInt(1000));
    // await setAllowance(somya, contract, BigInt(1000));
    // await deposit_collateral(somya, BigInt(1000)) 
    // await transferFrom("","",BigInt(0))
    // await withdraw_collateral(somya, BigInt(100))
    // await borrow(somya, BigInt(100))
    // await repay(somya, BigInt(100))

    
}

run()


// private key - user send tx 
// execute