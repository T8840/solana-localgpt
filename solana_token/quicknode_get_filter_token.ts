import { Connection, GetProgramAccountsFilter } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
const rpcEndpoint = 'https://responsive-radial-daylight.solana-devnet.discover.quiknode.pro/17a0c102a813bc5d90de934d610f960c6f74835e/'; //Replace with your RPC Endpoint

// const rpcEndpoint = 'https://example.solana-mainnet.quiknode.pro/000000/';
const solanaConnection = new Connection(rpcEndpoint);

const walletToQuery = 'BBJvVBsEgq5Nht52xCyb2BUDD9zkgYGgfpaNptyi27Lh'; //example: vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg
const MINT_TO_SEARCH = '2gvPhqaFPap7tDoXaKfWs2TZcRXkmooFBghmAf77Zf4x'; // Mint token Address


async function getFilterTokenAccounts(wallet: string, solanaConnection: Connection) {
    const filters:GetProgramAccountsFilter[] = [
        {
          dataSize: 165,    //size of account (bytes)
        },
        {
          memcmp: {
            offset: 32,     //location of our query in the account (bytes)
            bytes: wallet,  //our search criteria, a base58 encoded string
          },            
        },{
            memcmp: {
            offset: 0, //number of bytes
            bytes: MINT_TO_SEARCH, //base58 encoded string
            },
        }];
    const accounts = await solanaConnection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {filters: filters}
    );
    console.log(`Found ${accounts.length} token account(s) for wallet ${wallet}.`);
    if (accounts.length > 0) {
        const firstAccount = accounts[0];
        const parsedAccountInfo:any = firstAccount.account.data;
        const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
        const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
    
        // Log results for the first account
        console.log(`Token Account: ${firstAccount.pubkey.toString()}`);
        console.log(`--Token Mint: ${mintAddress}`);
        console.log(`--Token Balance: ${tokenBalance}`);
    } else {
        console.log('No accounts found.');
    }
}
getFilterTokenAccounts(walletToQuery,solanaConnection);
