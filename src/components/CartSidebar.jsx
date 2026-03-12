// src/components/CartSidebar.jsx
import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";
import CheckoutModal from "./CheckoutModal";

const CartSidebar = ({ open, onClose }) => {
  const { items, updateQty, removeFromCart, clearCart, total } = useCart(); // ← total added here
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.2 }}
            className="relative z-50 w-full max-w-md bg-white dark:bg-gray-900 p-5 shadow-2xl overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-4">Your Cart</h3>

            {items.length === 0 ? (
              <p className="text-sm opacity-70">Cart is empty.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {items.map((it, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <div className="w-16 h-16 rounded-lg bg-white/30 flex items-center justify-center border">
                      <img
                        src={it.icon}
                        alt={it.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{it.title}</p>
                      <p className="text-sm opacity-75">${it.price}</p>

                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          value={it.qty}
                          onChange={(e) =>
                            updateQty(it.title, Number(e.target.value))
                          }
                          className="w-20 rounded border px-2 py-1 text-sm bg-transparent"
                        />
                        <button
                          onClick={() => removeFromCart(it.title)}
                          className="text-sm underline underline-offset-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Total price section */}
                <div className="border-t pt-4 mt-2">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-semibold">Total</p>
                    <p className="font-bold text-lg text-primary">
                      $ {total}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCheckoutOpen(true)}
                      className="flex-1 bg-primary text-white rounded-lg px-4 py-2"
                    >
                      Proceed to Payment
                    </button>
                    <button
                      onClick={clearCart}
                      className="flex-1 border rounded-lg px-4 py-2"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </>
  );
};

export default CartSidebar;
