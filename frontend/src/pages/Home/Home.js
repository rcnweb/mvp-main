/* eslint-disable no-unused-vars */
import React, {useEffect} from "react";
import CategoryCarousel from "../../components/CategoryCarousel/CategoryCarousel";
import { useCart } from "../../context/CartContext";
import useBooks from "../../hooks/useBooks";

const categories = [
  { category: "programming", displayName: "Programação" },
  { category: "drama", displayName: "Drama" },
  { category: "science", displayName: "Ciência" },
];

const Home = () => {
  const { loadCart } = useCart();
  const { loading } = useBooks();

  useEffect(() => {
    loadCart();
  }, [loadCart])

  return (
    <>
    {!loading && (
      <div style={{ marginBottom: "6rem", marginTop: "2rem" }}>
        {categories.map((cat) => (
          <CategoryCarousel
            key={cat.category}
            category={cat.category}
            displayName={cat.displayName}
          />
        ))}
      </div>
    )}
    </>
  );
};

export default Home;
