import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
import { Link } from "react-router-dom"; 
import "./Header.css";
import { CiShoppingCart } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import CartPopup from "../CartPopup/CartPopup";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/authContext";
import { logout } from "../../services/usuario";

const Header = () => {
  const { cartCount } = useCart();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const toggleCartPopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleLogout = () => {
    logout(); 
    window.location.reload(); 
  };

  useEffect(() => {
  }, [isAuthenticated, user]);  

  return (
    <>
      <header className="header">
        <div className="logo">Loja de Livros</div>
        <div className="actions">
          {!isAuthenticated() ? (
            <>
              <Link to="/cadastro">
                <Button label="Criar Conta" />
              </Link>
              <Link to="/auth">
                <Button label="Entrar" />
              </Link>
            </>
          ) : (
            <>
              <div className="logout" onClick={handleLogout}>
                <IoIosLogOut size={40}/>
              </div>
            </>
          )}

          <div className="cart">
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            <div className="cart-icon-wrapper" onClick={toggleCartPopup}>
              <CiShoppingCart size={30}/>
            </div>
          </div>
        </div>
      </header>
      {isPopupOpen && <CartPopup onClose={toggleCartPopup} />}
    </>
  );
};

export default Header;
