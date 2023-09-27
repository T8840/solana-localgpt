import React, { useEffect, useState } from "react";
import { Connection, GetProgramAccountsFilter } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const rpcEndpoint = 'https://responsive-radial-daylight.solana-devnet.discover.quiknode.pro/17a0c102a813bc5d90de934d610f960c6f74835e/';
const solanaConnection = new Connection(rpcEndpoint);

const MINT_TO_SEARCH = '2gvPhqaFPap7tDoXaKfWs2TZcRXkmooFBghmAf77Zf4x';

const SolanaTokenAccounts: React.FC<{ wallet: string }> = ({ wallet }) => {
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    async function getTokenAccounts() {
      const filters: GetProgramAccountsFilter[] = [
        { dataSize: 165 },
        { 
          memcmp: { offset: 32, bytes: wallet }
        },
        {
          memcmp: { offset: 0, bytes: MINT_TO_SEARCH }
        }
      ];
      const fetchedAccounts = await solanaConnection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        { filters: filters }
      );
      setAccounts(fetchedAccounts);
    }

    getTokenAccounts();
  }, [wallet]);

  return (
    <div>
      <h3>Token Accounts for {wallet}</h3>
      {accounts.map((account, i) => {
        const parsedAccountInfo = account.account.data;
        const mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
        const tokenBalance = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        return (
          <div key={i}>
            <p>Token Account No. {i + 1}: {account.pubkey.toString()}</p>
            <p>--Token Mint: {mintAddress}</p>
            <p>--Token Balance: {tokenBalance}</p>
          </div>
        );
      })}
    </div>
  );
};

export default SolanaTokenAccounts;
