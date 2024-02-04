import React, { useState } from "react";
import { BrowserProvider } from "ethers";
import { SiweMessage } from "siwe";

export const BACKEND_ADDR = "https://localhost:4000/api/v1";

declare global {
  interface Window {
    ethereum: BrowserProvider;
  }
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inputValue: string) => void;
};

const Modal: React.FC = ({ isOpen, onClose, onSubmit }: ModalProps) => {
  const [inputValue, setInputValue] = React.useState("");

  if (!isOpen) return null;

  return (
    <div className="signup-modal">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={() => onSubmit(inputValue)}>Submit</button>
      <button className="close-modal" onClick={onClose}>Close</button>
    </div>
  );
};

export const EthereumAuth: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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

  async function signUpWithEthereum(username: string) {
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
      body: JSON.stringify({ message, signature, username }),
    });
    const data = await res.json();
    localStorage.setItem("user", JSON.stringify({ token: data.accessToken }));

    window.location.href = "/profile";
  }
  async function signInWithEthereum() {
    const signer = await provider.getSigner();

    const message = await createSiweMessage(
      signer.address,
      "Sign in with Ethereum to the app."
    );
    const signature = await signer.signMessage(message);

    const res = await fetch(`${BACKEND_ADDR}/user/signin`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, signature }),
    });
    const data = await res.json();

    localStorage.setItem("user", JSON.stringify({ token: data.accessToken }));

    window.location.href = "/profile";
  }
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
          <>
            <button onClick={handleOpenModal}>Sign up with Ethereum</button>
            <Modal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSubmit={signUpWithEthereum}
            />
          </>
        )}
      </div>
    </div>
  );
};
