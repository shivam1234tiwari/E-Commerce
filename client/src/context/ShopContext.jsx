// client/src/context/ShopContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // Load user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Load cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Auth Guard Helper
  const requireAuth = (redirectUrl = '/auth') => {
    if (!user) {
      navigate(redirectUrl);
      return false;
    }
    return true;
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/auth');
  };

  // Add To Cart with Auth Protection
  const addToCart = (product, quantity = 1) => {
    if (!requireAuth()) return;

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item._id === product._id);
      if (existing) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  // Direct Buy Now Action
  const buyNow = (product) => {
    if (!requireAuth()) return;
    addToCart(product, 1);
    navigate('/checkout');
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item._id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <ShopContext.Provider
      value={{
        user,
        setUser,
        logout,
        requireAuth,
        cartItems,
        addToCart,
        buyNow,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const ShopProvider = ShopContextProvider;
export default ShopContextProvider;