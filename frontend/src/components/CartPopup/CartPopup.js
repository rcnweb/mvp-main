import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import "./CartPopup.css";
import { FaPlus, FaMinus, FaTrash, FaChevronDown, FaChevronUp  } from "react-icons/fa";

const CartPopup = ({ onClose }) => {
  const { cartItems, cartTotal, updateItemQuantity, removeItemFromCart } = useCart();
  const [showAllItems, setShowAllItems] = useState(false);
  const [total, setTotal] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (cartTotal !== undefined) {
      setTotal(cartTotal);
    }
  }, [cartTotal]);

  const formattedTotal = total && !isNaN(total) ? total.toFixed(2) : "0.00";

  const handleShowMore = () => {
    setShowAllItems(true);
  };

  const handleCollapse = () => {
    setShowAllItems(false);
  };

  const shouldShowMoreButton = cartItems.length > 5;

  const handleAddQuantity = (item) => {
    updateItemQuantity(item.book_id, "increment");
  };

  const handleRemoveQuantity = (item) => {
    if (item.quantity > 1) {
      updateItemQuantity(item.book_id, "decrement");
    } else {
      removeItemFromCart(item.book_id);
    }
  };

  const handleRemoveItem = (item) => {
    removeItemFromCart(item.book_id);
  };

  const handleClose = () => {
    setIsClosing(true);  
    setTimeout(() => {
      onClose();  
    }, 300);  
  };

  return (
    <div className="cart-popup-overlay" onClick={handleClose}>
      <div className={`cart-popup-side ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <h2>Seu Carrinho</h2>
        {cartItems.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <div style={{ marginBottom: 0}} className={`cart-list ${showAllItems ? 'cart-list-expanded' : ''}`}>
            <ul>
              {cartItems.slice(0, showAllItems ? cartItems.length : 5).map((item) => (
                <li key={item.book_id}>
                  <p className="item-title">{item.title}</p>
                  <p className="item-price">Preço: R${item.price}</p>
                  <p className="item-quantity">Quantidade: {item.quantity}</p>

                  <div className="cart-actions">
                    <div className="cart-actions-buttons"> 
                      <div onClick={() => handleRemoveQuantity(item)}><FaMinus color="black"/></div>
                      <div onClick={() => handleAddQuantity(item)}><FaPlus color="black"/></div>
                    </div>
                    <div className="cart-actions-trash" onClick={() => handleRemoveItem(item)}><FaTrash color="black"/></div>
                  </div>
                  <hr />
                </li>
              ))}
            </ul>
          </div>
        )}
        {shouldShowMoreButton && (
          <div className="view-more" style={{display: "flex", justifyContent: "center"}} onClick={showAllItems ? handleCollapse : handleShowMore}>
            <div>
            {showAllItems ? <FaChevronUp size={30}/> : <FaChevronDown size={30}/> }
            </div>
          </div>
        )}
        <div>
          <h3 style={{ marginBottom: 0 }}>Total: R${formattedTotal}</h3>
        </div>
        <button style={{ marginBottom: "5rem" }} onClick={handleClose}>Fechar</button>
      </div>
    </div>
  );
};

export default CartPopup;
