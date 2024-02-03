import React, { useState } from "react";
import { BrowserProvider, ExternalProvider } from "ethers";
import { SiweMessage } from "siwe";

const BACKEND_ADDR = "http://localhost:4000";

declare global {
  interface Window {
    ethereum: ExternalProvider;
  }
}

export const EthereumAuth: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [signature, setSignature] = useState<string>("");

  const provider = new BrowserProvider(window.ethereum);

  async function createSiweMessage(
    address: string,
    statement: string
  ): Promise<string> {
    const res = await fetch(`${BACKEND_ADDR}/nonce`);
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

  async function signInWithEthereum() {
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const msg = await createSiweMessage(
      address,
      "Sign in with Ethereum to the app."
    );
    setMessage(msg);
    const sig = await signer.signMessage(msg);
    setSignature(sig);
  }

  //   async function sendForVerification() {
  //     const res = await fetch(`${BACKEND_ADDR}/verify`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ message, signature }),
  //     });
  //     console.log(await res.text());
  //   }

  return (
    <div>
      {!isWalletConnected && (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      <div className="button-container">
        {isWalletConnected && (
          <button onClick={signInWithEthereum}>Sign In with Ethereum</button>
        )}
        {isWalletConnected && (
          <button onClick={signInWithEthereum}>Sign up with Ethereum</button>
        )}
      </div>
    </div>
  );
};
