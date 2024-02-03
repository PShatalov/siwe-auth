import React, { useState } from "react";
import { BrowserProvider } from "ethers";
import { SiweMessage } from "siwe";

const BACKEND_ADDR = "https://localhost:4000/api/v1";

declare global {
  interface Window {
    ethereum: BrowserProvider;
  }
}

export const EthereumAuth: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);

  const provider = new BrowserProvider(window.ethereum);

  async function createSiweMessage(
    address: string,
    statement: string
  ): Promise<string> {
    const res = await fetch(`${BACKEND_ADDR}/nonce`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    const nonce = await res.text();
    const siweMessage = new SiweMessage({
      domain: window.location.host,
      address,
      statement,
      uri: window.location.origin,
      version: "1",
      chainId: "1",
      nonce,
    });
    return siweMessage.prepareMessage();
  }

  async function connectWallet() {
    try {
      await provider.send("eth_requestAccounts", []);
      console.log("Wallet connected");
      setIsWalletConnected(true);
    } catch (error) {
      console.log("User rejected request");
    }
  }

  async function signUpWithEthereum() {
    const signer = await provider.getSigner();

    const message = await createSiweMessage(
      signer.address,
      "Sign in with Ethereum to the app."
    );
    const signature = await signer.signMessage(message);

    const res = await fetch(`${BACKEND_ADDR}/user/signup`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, signature }),
    });
    return await res.json();
  }

  return (
    <div>
      {!isWalletConnected && (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      <div className="button-container">
        {isWalletConnected && (
          <button onClick={signUpWithEthereum}>Sign In with Ethereum</button>
        )}
        {isWalletConnected && (
          <button onClick={signUpWithEthereum}>Sign up with Ethereum</button>
        )}
      </div>
    </div>
  );
};
