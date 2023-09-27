import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import supabaseClient from "../lib/supabaseClient";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useWalletState } from "../components/WalletContextProvider"
// import { useConnection, useWallet } from "@solana/wallet-adapter-react"
// const { publicKey, connected } = useWallet();


interface UserStateContextProps {
  bearer: any;
  wallet_address: any;
  wallet_private_key : any;
  vectorstore: any;
  setVectorstore: any;
}

const UserStateContext = createContext<UserStateContextProps>(undefined!);

export function UserStateProvider({ children }: PropsWithChildren<any>) {
  const [bearer, setBearer] = useState(null)
  const [wallet, setWalletAddress] = useState(null)
  const [wallet_private_key, setWalletPrivateKey] = useState(null)
  const [email, setEmail] = useState(null)
  const [email_password, setEmailPassword] = useState(null)

  const [vectorstore, setVectorstore] = useState(null)

  const navigate = useNavigate();
  const { isWalletConnected } = useWalletState();
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
     if (!isWalletConnected) {
      // 在重定向之前检查localStorage
      const userLoggedIn = localStorage.getItem('userLoggedIn');

      if (!userLoggedIn) {
        // 如果用户未登录，等待一段时间后再导航，确保钱包确实断开连接
        timeoutId = setTimeout(() => {
          navigate("/authentication/sign-in");
        }, 1000); // 这里等待1秒，可以根据需要调整
      }
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isWalletConnected, navigate]);


  const fetchData = async () => {
    console.log("fetching data");
    try {
      // Ensure the wallet address is available
      const walletAddress = localStorage.getItem('walletAddress');

      if (!walletAddress) {
        console.error("Wallet address is missing");
        return;
      }

      // 获取你的应用的Token或认证信息。可能是来自Supabase或其他服务。
      // const token = "solana-gpt-token";
      const supabase = await supabaseClient()

      const { data, error } = await supabase.from('users').select('*').eq('bearer', walletAddress);
      console.log(error);

      if (data && data[0]) {
        setBearer(data[0]['bearer'])
        setWalletAddress(data[0]['wallet_address'])
        setWalletPrivateKey(data[0]['wallet_private_key'])

        setVectorstore(data[0]['vectorstore'])
      } else {
        console.log("users.insert");
        const response = await supabase.from('users').insert({
          user_id: uuidv4(),
          bearer: walletAddress,
          app_id: uuidv4(),
          wallet_address: walletAddress // replace "email: email" with the wallet address
        }).select()

        if (response.data && response.data[0]) {
          console.log(response.data)
          setBearer(response.data[0]['bearer'])
          setVectorstore(response.data[0]['vectorstore'])
        } else {
          setBearer(null)
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <UserStateContext.Provider
      value={{
        bearer: bearer,
        vectorstore: vectorstore,
        setVectorstore: setVectorstore
      }}
    >
      {children}
    </UserStateContext.Provider>
  );
}

export function useUserStateContext(): UserStateContextProps {
  const context = useContext(UserStateContext);

  if (typeof context === "undefined") {
    throw new Error(
      "useUserStateContext should be used within the UserStateContext provider!"
    );
  }

  return context;
}
