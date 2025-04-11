import React from "react";
import "./BookCard.css";
import Button from '../Button/Button'

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <img src={book.image} alt={book.title} className="book-image" />
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <p>{book.price}</p>
      <Button label="Adicionar ao Carrinho" />
    </div>
  );
};

export default BookCard;
