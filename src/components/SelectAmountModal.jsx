import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const SelectAmountModal = ({ product, onClose, onConfirm }) => {
  const [amount, setAmount] = useState("");

  const [min, max] = product.range
    .replace(/\$/g, "")
    .split("-")
    .map(v => Number(v.trim()));

  const handleConfirm = () => {
    const value = Number(amount);
    if (isNaN(value) || value < min || value > max) {
      alert(`Please enter a valid amount between $${min} and $${max}.`);
      return;
    }
    onConfirm(value);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-50 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-semibold mb-2">Select Amount</h3>
        <p className="text-sm opacity-70 mb-4">
          Enter an amount between <strong>${min}</strong> and <strong>${max}</strong> for this card.
        </p>

        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder={`e.g. ${min}`}
          className="w-full rounded border px-3 py-2 mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-primary text-white rounded-lg px-4 py-2"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectAmountModal;
