import { Connection, PublicKey, Keypair, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { createBurnCheckedInstruction, TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import 'dotenv/config';
require('dotenv').config()
const secret = JSON.parse(process.env.PRIVATE_KEY2 ?? "") as number[]
const secretKey = Uint8Array.from(secret)
const WALLET = Keypair.fromSecretKey(secretKey)


const MINT_ADDRESS = '2gvPhqaFPap7tDoXaKfWs2TZcRXkmooFBghmAf77Zf4x'; // USDC-Dev from spl-token-faucet.com | replace with the mint you would like to burn
const MINT_DECIMALS = 9; // Value for USDC-Dev from spl-token-faucet.com | replace with the no. decimals of mint you would like to burn
const BURN_QUANTITY = 1; // Number of tokens to burn (feel free to replace with any number - just make sure you have enough)

const rpcEndpoint = 'https://responsive-radial-daylight.solana-devnet.discover.quiknode.pro/17a0c102a813bc5d90de934d610f960c6f74835e/'; //Replace with your RPC Endpoint
const SOLANA_CONNECTION = new Connection(rpcEndpoint);

(async () => {
    console.log(`Attempting to burn ${BURN_QUANTITY} [${MINT_ADDRESS}] tokens from Owner Wallet: ${WALLET.publicKey.toString()}`);
    console.log("----------WALLET.publicKey---------",WALLET.publicKey)
    
    // Step 1 - Fetch Associated Token Account Address
    console.log(`Step 1 - Fetch Token Account`);
    const account = await getAssociatedTokenAddress(new PublicKey(MINT_ADDRESS), WALLET.publicKey);
    console.log(`    ✅ - Associated Token Account Address: ${account.toString()}`);
    // Step 2 - Create Burn Instructions
    console.log(`Step 2 - Create Burn Instructions`);
    const burnIx = createBurnCheckedInstruction(
      account, // PublicKey of Owner's Associated Token Account
      new PublicKey(MINT_ADDRESS), // Public Key of the Token Mint Address
      WALLET.publicKey, // Public Key of Owner's Wallet
      BURN_QUANTITY * (10**MINT_DECIMALS), // Number of tokens to burn
      MINT_DECIMALS // Number of Decimals of the Token Mint
    );
    console.log("-------burnIX-----------",burnIx)
    console.log(`    ✅ - Burn Instruction Created`);


    // Step 3 - Fetch Blockhash
    console.log(`Step 3 - Fetch Blockhash`);
    const { blockhash, lastValidBlockHeight } = await SOLANA_CONNECTION.getLatestBlockhash('finalized');
    console.log(`    ✅ - Latest Blockhash: ${blockhash}`);

    // Step 4 - Assemble Transaction
    console.log(`Step 4 - Assemble Transaction`);
    const messageV0 = new TransactionMessage({
      payerKey: WALLET.publicKey,
      recentBlockhash: blockhash,
      instructions: [burnIx]
    }).compileToV0Message();
    console.log("____________messageV0_____________",messageV0)
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([WALLET]);
    console.log(`    ✅ - Transaction Created and Signed`);

    // Step 5 - Execute & Confirm Transaction 
    console.log(`Step 5 - Execute & Confirm Transaction`);
    const txid = await SOLANA_CONNECTION.sendTransaction(transaction);
    console.log("    ✅ - Transaction sent to network");
    const confirmation = await SOLANA_CONNECTION.confirmTransaction({
        signature: txid,
        blockhash: blockhash,
        lastValidBlockHeight: lastValidBlockHeight
    });
    if (confirmation.value.err) { throw new Error("    ❌ - Transaction not confirmed.") }
    console.log('🔥 SUCCESSFUL BURN!🔥', '\n', `https://explorer.solana.com/tx/${txid}?cluster=devnet`);
})()