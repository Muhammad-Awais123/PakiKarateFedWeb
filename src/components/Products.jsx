import React, { useState } from "react";
import { motion } from "framer-motion";
import { Share2, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import CartSidebar from "./CartSidebar";
import SelectAmountModal from "./SelectAmountModal";

// assets
import product_amazon from "../assets/product_amazon.jpeg";
import product_apple_card from "../assets/product_apple_card.jpeg";
import american_express from "../assets/american_express.jpeg";
import product_foodpanda from "../assets/product_foodpanda.jpeg";

const WHATSAPP_NUMBER = "923148680400";
const CONTACT_WHATSAPP_DISPLAY = "0314-8680400";

const productsData = [
  {
    title: "Amazon E-Gift Card",
    range: "$500 - $25000",
    description: "Purchase millions of products worldwide.",
    icon: product_amazon,
  },
  {
    title: "Apple Pay Gift Card",
    range: "$100 - $2000",
    description: "Apps, music, movies and Apple services.",
    icon: product_apple_card,
  },
  {
    title: "American Express Gift Card",
    range: "$500 - $1000",
    description: "Globally accepted for online and in-store.",
    icon: american_express,
  },
  {
    title: "FoodPanda Voucher",
    range: "$5 - $200",
    description: "Order food with instant e-voucher delivery.",
    icon: product_foodpanda,
  },
];

const Products = () => {
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, count } = useCart();

  const handleShare = async (product) => {
    const shareText = `Check this out: ${product.title} — ${product.range}. Contact: ${CONTACT_WHATSAPP_DISPLAY}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: shareText,
          url: window.location.href,
        });
      } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(
          `${shareText} ${window.location.href}`
        );
        alert("Product details copied to clipboard.");
      } catch {
        alert("Unable to copy to clipboard.");
      }
    }
  };

  return (
    <>
      <motion.section
        id="products"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative px-6 sm:px-12 text-center lg:px-20 xl:px-36 py-20"
      >
        <h1 className="font-bold text-4xl md:text-5xl text-center text-black dark:text-white">
          Featured Products
        </h1>

        <p className="mt-2 text-black/70 dark:text-white/70">
          Glassmorphism cards — Buy Now and checkout using bank transfer upload.
        </p>

        {/* Product Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {productsData.map((product, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative rounded-2xl p-5 bg-white/10 border border-white/20 backdrop-blur-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-full h-48 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center shadow-inner">
                  <img
                    src={product.icon}
                    alt={product.title}
                    className="object-contain w-full h-full rounded-xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* TEXT COLORS — Light: Black / Dark: White */}
                <h3 className="text-lg font-semibold mt-2 text-black dark:text-white">
                  {product.title}
                </h3>

                <p className="text-sm text-black/70 dark:text-white/70">
                  {product.description}
                </p>

                <p className="font-bold text-black dark:text-white text-base">
                  {product.range}
                </p>

                <div className="flex gap-3 w-full mt-4 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="flex-1 rounded-lg px-4 py-2 bg-gradient-to-r from-[#00b4d8] to-[#5e60ce] text-white font-semibold shadow hover:opacity-90 transition"
                  >
                    Buy Now
                  </button>

                  <button
                    onClick={() => handleShare(product)}
                    className="rounded-lg px-3 py-2 border border-white/20 hover:bg-white/10 transition"
                  >
                    <Share2 size={16} className="text-black dark:text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Modal */}
      {selectedProduct && (
        <SelectAmountModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={(price) => {
            addToCart({ ...selectedProduct, price });
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Floating Cart Button */}
      <div className="fixed right-6 bottom-6 z-50">
        <button
          onClick={() => setShowCart(true)}
          className="relative bg-gradient-to-r from-[#00b4d8] to-[#5e60ce] text-white p-4 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <ShoppingCart size={20} />
          <span className="text-sm font-medium">Cart</span>

          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>

      <CartSidebar open={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};

export default Products;
