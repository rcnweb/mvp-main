/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { addToCart, getCart, removeFromCart, clearCart } from "../services/cart";

const useCart = () => {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const handleAddToCart = async (book) => {
    try {
      const quantity = 1; 
      const response = await addToCart(book.id, book.title, book.price, quantity);
      setCart((prevCart) => {
        const updatedCart = [...prevCart, response];
        
        const total = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setCartTotal(total);
        return updatedCart;
      });
    } catch (error) {
      console.error("Erro ao adicionar item ao carrinho", error);
    }
  };


const loadCart = useCallback(async () => {
  try {
    const cartItems = await getCart();
    const items = Array.isArray(cartItems) ? cartItems : cartItems.cart;

    if (Array.isArray(items)) {
      setCart(items);
      const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setCartTotal(total);
    } else {
      console.error("Erro: O carrinho não é um array", cartItems);
    }
  } catch (error) {
    console.error("Erro ao carregar o carrinho", error);
  }
}, []); 

  const handleRemoveFromCart = async (bookId) => {
    try {
      await removeFromCart(bookId);
      setCart(cart.filter(item => item.book_id !== bookId));  
    } catch (error) {
      console.error("Erro ao remover item do carrinho", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setCart([]);  
    } catch (error) {
      console.error("Erro ao limpar o carrinho", error);
    }
  };

  return {
    cart,
    cartTotal,
    handleAddToCart,
    loadCart,
    handleRemoveFromCart,
    handleClearCart,
  };
};

export default useCart;
