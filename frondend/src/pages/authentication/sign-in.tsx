import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SignInPage: FC = function () {
  const { publicKey,connected } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (connected) {
      navigate('/');
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("walletAddress", publicKey?.toBase58() || "");

    } else {
      localStorage.removeItem("userLoggedIn");
    }
  }, [connected, navigate]);

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12 bg-cover bg-center"
         style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1691335032737-dc0e04a16b03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY5NTY5MjA5Nw&ixlib=rb-4.0.3&q=80&w=1080)' }}>
      <div className="my-6 flex items-center gap-x-1 lg:my-0">
        <div className="mb-6">
            <WalletMultiButton />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
