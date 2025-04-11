/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import PaginationButton from "../../components/PaginationButton/PaginationButton";
import { Tooltip } from "react-tooltip";
import useBooks from "../../hooks/useBooks";
import { useCart } from "../../context/CartContext"; 
import Loading from "../Loading/Loading";
import './CategoryCarousel.css';

const CategoryCarousel = ({ category, displayName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { books, loading, hasNext  } = useBooks(category, currentPage);
  const { addItemToCart  } = useCart();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleNext = () => {
    if (hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!loading && currentPage > 1) {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  };

  return (
    <>
    {loading ? (
      <Loading />
    ) : (
    <div className="carousel" >
      <div className="carousel-container">
      <h2 className="carousel-title">{displayName}</h2>

          <Swiper
            spaceBetween={20}
            slidesPerView={5}
            style={{ padding: "0.5rem 2rem", maxWidth: "95%", width: "95%" }}
          >
            <PaginationButton
              direction="left"
              onClick={handlePrev}
              disabled={currentPage === 1}
            />
            <PaginationButton direction="right" onClick={handleNext} />

            {books.map((book, index) => {
              const titleExceedsLimit = book.title.length > 30;
              const authorsText = book.authors.join(", ");
              const authorsExceedLimit = authorsText.length > 50;

              return (
                <SwiperSlide key={book.id}>
                  <div className="carousel-book-card">
                    <img className="carousel-book-image" src={book.thumbnail} alt={book.title}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      style={{
                        width: "10rem",
                        height: "15rem",
                        borderRadius: "7%",
                        marginTop: "1rem",
                        transition: "transform 0.3s ease",
                        transform:
                          hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                        boxShadow: "10px 6px 9px rgba(0, 0, 0, 0.5)", 
                        cursor: "pointer",
                      }}/>

                    <h3 className="book-title" data-tooltip-id={titleExceedsLimit ? `tooltip-title-${book.id}` : undefined}
                      data-tooltip-content={titleExceedsLimit ? book.title : undefined}
                      style={{
                        cursor: titleExceedsLimit ? "pointer" : "default",
                      }}>
                      {book.title}
                    </h3>

                    {titleExceedsLimit && (
                      <Tooltip
                        id={`tooltip-title-${book.id}`}
                        place="top"
                        style={{ width: "70%" }}
                      />
                    )}

                    <p className="book-authors" data-tooltip-id={authorsExceedLimit ? `tooltip-authors-${book.id}` : undefined}
                      data-tooltip-content={authorsExceedLimit ? authorsText : undefined}
                      style={{
                        cursor: authorsExceedLimit ? "pointer" : "default",
                      }}>
                      {authorsText}
                    </p>
                    
                    {authorsExceedLimit && (
                      <Tooltip
                        id={`tooltip-authors-${book.id}`}
                        place="top"
                        style={{ width: "70%" }}
                      />
                    )}

                    <p className="book-price">R${book.price}</p>

                    <button className="book-add-cart"onClick={() => addItemToCart(book)}>
                      <CiShoppingCart size={30} />
                    </button>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
      </div>
    </div>
    )}
    </>
  );
};

export default CategoryCarousel;