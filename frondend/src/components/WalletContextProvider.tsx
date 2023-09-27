import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as web3 from "@solana/web3.js";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";
import { createContext, useContext, useEffect, useState, FC, ReactNode } from "react";

interface WalletContextProps {
  isWalletConnected: boolean;
  // walletAddress : string | null | undefined;
}

const WalletStateContext = createContext<WalletContextProps | undefined>(undefined);

export const useWalletState = (): WalletContextProps => {
  const context = useContext(WalletStateContext);

  if (!context) {
    throw new Error("useWalletState must be used within a WalletStateProvider");
  }

  return context;
};



const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connected } = useWallet();

  const endpoint = web3.clusterApiUrl("devnet");
  const wallets = [
    new walletAdapterWallets.PhantomWalletAdapter(),
    new walletAdapterWallets.SolflareWalletAdapter(),
  ];
  

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("userLoggedIn");
    if (userLoggedIn) {
      console.log("User is already logged in.");
    } else {
      console.log("User is not logged in.");
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletStateContext.Provider value={{ isWalletConnected: connected }}>
        {/* <WalletStateContext.Provider value={{ isWalletConnected: connected , walletAddress: publicKey?.toBase58() }}> */}
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletStateContext.Provider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
