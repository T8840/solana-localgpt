import React, { useEffect, useState } from 'react';
import NavbarSidebarLayout from '../../layouts/navbar-sidebar';
import { Table } from "flowbite-react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { notify } from "../../utils/notifications";
interface TokenCost {
    tokenName: string;
    cost: number;
}

const UserTokenCostPage: React.FC = () => {
    const [tokenCosts, setTokenCosts] = useState<TokenCost[]>([]);
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [transactionHistory, setTransactionHistory] = useState<ParsedTransactionWithMeta[]>(null);
    const [transactionTable, setTransactionTable] = useState<JSX.Element>(null);

    useEffect(() => {
        if (publicKey && transactionHistory) {
            buildTransactionTable();
        }
      }, [publicKey, connection, transactionHistory])


     async function getTransactions(address, numTx) {
        const pubKey = new PublicKey(address);
        //Find recent transactions
        let transactionList = await connection.getSignaturesForAddress(pubKey, {limit:numTx});
        //Parse transactions to get signature for recent transactions 
        let signatureList = transactionList.map(transaction=>transaction.signature);
        //Get parsed details of each transaction 
        let transactionDetails = await connection.getParsedTransactions(signatureList, {maxSupportedTransactionVersion:0});
        //Update State
        setTransactionHistory(transactionDetails);

    }

    function buildTransactionTable() {
        if(transactionHistory && transactionHistory.length !== 0) {
            console.log(transactionHistory[0]);
            let header = (
                <thead className="text-xs text-gray-700 uppercase bg-zinc-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-3">Transaction Signature</th>
                        <th className="px-6 py-3">Slot</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Result</th>
                    </tr>
                </thead>
                )
            let rows = transactionHistory.map((transaction, i)=>{
                let date = new Date(transaction.blockTime*1000).toLocaleDateString();
                return (
                    <tr  key={i+1} className="bg-white border-b bg-zinc-800 dark:border-zinc-700">
                        <td className="px-6 py-3">
                                {/* some transactions return more than 1 signature -- we only want the 1st one */} 
                                {transaction.transaction.signatures[0]}
                        </td>
                        <td className="px-6 py-3">{transaction.slot.toLocaleString("en-US")}</td>
                        <td className="px-6 py-3">{date}</td>
                        <td className="px-6 py-3">{transaction.meta.err ? 'Failed' : 'Success'}</td>
                    </tr>)
            })
            setTransactionTable(
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    {header}
                    <tbody>{rows}</tbody>
                </table>)
        } 
        else {
            setTransactionTable(null);
        }
    }

    const onClick = async () => {
        if (!publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }
        try { 
            await getTransactions(publicKey.toString(),15);

        } catch (error: any) {
            notify({ type: 'error', message: `Couldn't Find Transactions!`, description: error?.message });
            console.log('error', `Error finding Transactions! ${error?.message}`);
        }
    };

    return (
        <NavbarSidebarLayout isFooter={false}>
            <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-1 w-full">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                        User Token Costs
                    </h1>
                </div>
            </div>
            <div className="text-center">
        <button
                className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] center hover:from-pink-500 hover:to-yellow-500 ..."
                onClick={onClick}
            >
                <span>Get Transactions</span>
        </button>
        </div>

        {/* Render Results Here */}
        <div>{transactionTable}</div>
        </NavbarSidebarLayout>
    );
}

export default UserTokenCostPage;
