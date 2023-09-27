import React, { useEffect, useState } from 'react';
import NavbarSidebarLayout from '../../layouts/navbar-sidebar';
import { Table, Button } from "flowbite-react";
import { sendTokens, getFilterTokenAccounts } from '../../lib/solanaUtils';
import { useWallet } from "@solana/wallet-adapter-react";

const AirDropPage: React.FC = () => {
    const { publicKey, connected } = useWallet();
    const wallet = publicKey?.toBase58();
    const [balance, setBalance] = useState<number | null>(null);

    const alertLogin = () => {
        alert("请先登录钱包!");
    };

    const handleAirdrop = async (e: any) => {
        e.preventDefault();
        const userLoggedIn = localStorage.getItem('userLoggedIn');

        if (!userLoggedIn) {
            alertLogin();
            return;
        }

        if (!wallet) {
            alert("Please connect your wallet first!");
            return;
        }

        try {
            await sendTokens(wallet);
        } catch (error) {
            console.error("Error sending tokens:", error);
            alert("Error sending tokens. Please try again later.");
        }
    };

    useEffect(() => {
        let isMounted = true;
        async function fetchBalance() {
            const wallet = publicKey?.toBase58();
            if (wallet) {
                const retrievedBalance = await getFilterTokenAccounts(wallet);
                if (isMounted) {
                    setBalance(retrievedBalance);
                }
            }
        }

        fetchBalance();
        return () => {
            isMounted = false;
        };
    }, [publicKey]);

    return (
        <NavbarSidebarLayout isFooter={false} >
                         <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-1 w-full">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                            AirDrop
                        </h1>
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Wallet Address: {wallet || 'Not connected'}
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Token Balance: {balance || '0'}
                    </div>
                </div>
                <div className="mt-4">
                    <Button color="primary" onClick={handleAirdrop}>Get Airdrop</Button>

                {/* <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12 bg-cover bg-center"
         style={{ backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1670590820916-b6dbbf792561?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY5NTY5ODk1NQ&ixlib=rb-4.0.3&q=80&w=1080)' }}></div> */}

                </div>
        </NavbarSidebarLayout>
    );
}

export default AirDropPage;