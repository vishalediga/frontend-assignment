import React, { createContext, useContext, useState } from "react";

// Create the CartContext
const CartContext = createContext();

// Create a provider component to manage cart state
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [address, setAddress] = useState("");

  const toggleCart = () => {
    setCartOpen(!isCartOpen);
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: product.quantity || 1 }];
    });
    alert(`${product.productName} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const placeOrder = () => {
    if (!address.trim()) {
      alert("Please enter your address to place the order.");
      return;
    }
    alert("Order placed successfully!");
    setCart([]);
    setAddress("");
    setCartOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        toggleCart,
        addToCart,
        removeFromCart,
        address,
        setAddress,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook for easier access to the cart context
export const useCart = () => useContext(CartContext);
