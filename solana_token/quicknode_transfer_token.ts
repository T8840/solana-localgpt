import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from "@solana/spl-token";
import { Connection,GetProgramAccountsFilter, Keypair, ParsedAccountData, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
const rpcEndpoint = 'https://responsive-radial-daylight.solana-devnet.discover.quiknode.pro/17a0c102a813bc5d90de934d610f960c6f74835e/'; //Replace with your RPC Endpoint

// const rpcEndpoint = 'https://example.solana-mainnet.quiknode.pro/000000/';
const SOLANA_CONNECTION = new Connection(rpcEndpoint);

// const DESTINATION_WALLET = 'GVE5VVpxEiTtCYA3Jx2DGg8DDUVWLw5H1E6n547Ug3k3';  
// 不要给无任何sol未激活的地址转账，不然会出现下面的错误
/*
    if (!info) throw new TokenAccountNotFoundError();
                     ^
TokenAccountNotFoundError
    at unpackAccount (D:\Code\WEB3\Solana\solana-token\node_modules\@solana\spl-token\src\state\account.ts:170:22)
    at D:\Code\WEB3\Solana\solana-token\node_modules\@solana\spl-token\src\state\account.ts:103:12
    at Generator.next (<anonymous>)
    at fulfilled (D:\Code\WEB3\Solana\solana-token\node_modules\@solana\spl-token\lib\cjs\state\account.js:5:58)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
*/
const DESTINATION_WALLET = '57uYfxxUMATgoZzzf6F3HqG5jxX6x5pjCA5Mdet33uvN';  

const MINT_ADDRESS = '2gvPhqaFPap7tDoXaKfWs2TZcRXkmooFBghmAf77Zf4x'; //You must change this value!
const TRANSFER_AMOUNT = 1;
import 'dotenv/config';
require('dotenv').config()
const secret = JSON.parse(process.env.PRIVATE_KEY2 ?? "") as number[]
const secretKey = Uint8Array.from(secret)
console.log("secretKey",secretKey)
const FROM_KEYPAIR = Keypair.fromSecretKey(secretKey)

async function getNumberDecimals(mintAddress: string):Promise<number> {
    const info = await SOLANA_CONNECTION.getParsedAccountInfo(new PublicKey(MINT_ADDRESS));
    const result = (info.value?.data as ParsedAccountData).parsed.info.decimals as number;
    return result;
}

async function sendTokens() {

    console.log(`Sending ${TRANSFER_AMOUNT} ${(MINT_ADDRESS)} from ${(FROM_KEYPAIR.publicKey.toString())} to ${(DESTINATION_WALLET)}.`)
    //Step 1
    console.log(`1 - Getting Source Token Account`);
    let sourceAccount = await getOrCreateAssociatedTokenAccount(
        SOLANA_CONNECTION, 
        FROM_KEYPAIR,
        new PublicKey(MINT_ADDRESS),
        FROM_KEYPAIR.publicKey
    );
    console.log(`    Source Account: ${sourceAccount.address.toString()}`);

    //Step 2
    console.log(`2 - Getting Destination Token Account`);
    let destinationAccount = await getOrCreateAssociatedTokenAccount(
        SOLANA_CONNECTION, 
        FROM_KEYPAIR,
        new PublicKey(MINT_ADDRESS),
        new PublicKey(DESTINATION_WALLET)
    );
    console.log(`    Destination Account: ${destinationAccount.address.toString()}`);


    //Step 3
    console.log(`3 - Fetching Number of Decimals for Mint: ${MINT_ADDRESS}`);
    const numberDecimals = await getNumberDecimals(MINT_ADDRESS);
    console.log(`    Number of Decimals: ${numberDecimals}`);

    //Step 4
    console.log(`4 - Creating and Sending Transaction`);
    const tx = new Transaction();
    tx.add(createTransferInstruction(
        sourceAccount.address,
        destinationAccount.address,
        FROM_KEYPAIR.publicKey,
        TRANSFER_AMOUNT * Math.pow(10, numberDecimals)
    ))


    const latestBlockHash = await SOLANA_CONNECTION.getLatestBlockhash('confirmed');
    tx.recentBlockhash = await latestBlockHash.blockhash;    
    const signature = await sendAndConfirmTransaction(SOLANA_CONNECTION,tx,[FROM_KEYPAIR]);
    console.log(
        '\x1b[32m', //Green Text
        `   Transaction Success!🎉`,
        `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
}


sendTokens();

