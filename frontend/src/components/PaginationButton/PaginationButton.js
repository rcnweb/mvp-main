import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PaginationButton = ({ direction = "left", onClick, disabled = false }) => {
  const isLeft = direction === "left";
  const Icon = isLeft ? FaChevronLeft : FaChevronRight;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        position: "absolute",
        top: "50%",
        [isLeft ? "left" : "right"]: 0,
        transform: "translateY(-50%)",
        zIndex: 10,
        background: "lightgray",
        border: "1px solid #ccc",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        cursor: "pointer",
        opacity: disabled ? 0.5 : 1,
        color: "black",
        marginLeft: "2.2rem",
        marginRight: "2.2rem",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Icon />
    </button>
  );
};

export default PaginationButton;
