import { useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inputValue: string) => void;
};

export const SignUpModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  return (
    <div className="signup-modal">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={() => onSubmit(inputValue)}>Submit</button>
      <button className="close-modal" onClick={onClose}>
        Close
      </button>
    </div>
  );
};
