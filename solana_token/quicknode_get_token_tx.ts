
import { Connection,GetProgramAccountsFilter, Keypair, ParsedAccountData, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
const rpcEndpoint = 'https://responsive-radial-daylight.solana-devnet.discover.quiknode.pro/17a0c102a813bc5d90de934d610f960c6f74835e/'; //Replace with your RPC Endpoint

// const rpcEndpoint = 'https://example.solana-mainnet.quiknode.pro/000000/';
const solanaConnection = new Connection(rpcEndpoint);


const getTransactions = async(address:string, numTx:number) => {
    const pubKey = new PublicKey(address);
    let transactionList = await solanaConnection.getSignaturesForAddress(pubKey, {limit:numTx});
    transactionList.forEach((transaction, i) => {
        if (transaction.blockTime) {
            const date = new Date(transaction.blockTime*1000);
            console.log(`Transaction No: ${i+1}`);
            console.log(`Signature: ${transaction.signature}`);
            console.log(`Time: ${date}`);
            console.log(`Status: ${transaction.confirmationStatus}`);
            console.log(("-").repeat(20));
        }
        
    })
}

getTransactions("BBJvVBsEgq5Nht52xCyb2BUDD9zkgYGgfpaNptyi27Lh",3);

