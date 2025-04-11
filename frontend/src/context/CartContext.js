import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCart, addToCart, removeFromCart, updateCartItem } from "../services/cart";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0); 

  const recalculateTotal = useCallback(async () => {
    const total = cartItems.reduce(
      (acc, item) => acc + (item.price * item.quantity || 0),
      0
    );
    return total;
  }, [cartItems]);

  const recalculateCartCount = useCallback(() => {
    return cartItems.length;
  }, [cartItems]);


  const loadCart = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        return;
      }
      const response = await getCart();
      const items = response?.cart;
      const total = response?.cart_total; 

      if (Array.isArray(items)) {
        setCartItems(items);
        setCartCount(items.length);
        setCartTotal(total);  
      } else {
        console.error("Resposta inválida para o carrinho:", response);
        setCartItems([]);
        setCartTotal(0);
      }
    } catch (error) {
      console.error("Erro ao carregar o carrinho", error);
      setCartItems([]);
      setCartTotal(0);
    }
  }, []);


  const addItemToCart = async (item) => {
    try {
      const response = await addToCart(item.id, item.title, item.price, 1);
      if (response) {
        setCartItems((prevItems) => {
          const bookId = item.book_id || item.id;
          const index = prevItems.findIndex((i) => i.book_id === bookId);
          if (index !== -1) {
            const updatedItems = [...prevItems];
            updatedItems[index] = {
              ...updatedItems[index],
              quantity: updatedItems[index].quantity + 1,
            };
            return updatedItems;
          } else {
            return [...prevItems, { ...item, book_id: bookId, quantity: 1 }];
          }
        });
        toast.success("Item adicionado ao carrinho!");  
      }
    } catch (err) {
      console.error("Erro ao adicionar item ao carrinho", err);
      toast.error("Erro ao adicionar item ao carrinho!");  
    }
  };

  const removeItemFromCart = async (itemId) => {
    try {
      const response = await removeFromCart(itemId);
      if (response) {
        setCartItems((prevItems) => {
          const updatedItems = prevItems.filter((item) => item.book_id !== itemId);
          return updatedItems;
        });
        toast.success("Item removido do carrinho!"); 
      }
    } catch (err) {
      console.error("Erro ao remover item do carrinho", err);
      toast.error("Erro ao remover item do carrinho!");  
    }
  };

  const updateItemQuantity = async (itemId, action) => {
    try {
      const response = await updateCartItem(itemId, action);
      if (response) {
        setCartItems((prevItems) => {
          const updatedItems = prevItems.map((item) =>
            item.book_id === itemId
              ? {
                  ...item,
                  quantity: action === "increment" ? item.quantity + 1 : item.quantity - 1,
                }
              : item
          );
          return updatedItems;
        });
        toast.success(`Quantidade ${action === "increment" ? "aumentada" : "reduzida"}!`); 
      }
    } catch (err) {
      console.error("Erro ao atualizar a quantidade do item", err);
      toast.error("Erro ao atualizar a quantidade do item!");  
    }
  };

  useEffect(() => {
    const updateTotal = async () => {
      const newTotal = await recalculateTotal();
      setCartTotal(newTotal);
    };
    updateTotal();
  }, [cartItems, recalculateTotal]); 

  useEffect(() => {
    const newCount = recalculateCartCount();
    setCartCount(newCount);
  }, [cartItems, recalculateCartCount]);

  return (
    <CartContext.Provider value={{ cartItems, cartTotal, cartCount, addItemToCart, removeItemFromCart, updateItemQuantity, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
