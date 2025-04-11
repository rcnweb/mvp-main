import axiosInstance from "../config/axiosConfig";

// Função para adicionar item ao carrinho
export const addToCart = async (bookId, title, price, quantity) => {
  try {
    const response = await axiosInstance.post("/cart/add", {
      book_id: bookId,
      title,
      price,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar livro ao carrinho", error);
    throw error;
  }
};

// Função para adicionar item ao carrinho
export const updateCartItem = async (bookId, action) => {
  try {
    const response = await axiosInstance.put("/cart/update", {
      book_id: bookId,
      action
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar livro no carrinho", error);
    throw error;
  }
};

// Função para listar itens do carrinho
export const getCart = async () => {
  try {
    const response = await axiosInstance.get("/cart/list");
    return response.data;
  } catch (error) {
    console.error("Erro ao listar carrinho", error);
    throw error;
  }
};

// Função para remover item do carrinho
export const removeFromCart = async (bookId) => {
  try {
    const response = await axiosInstance.delete(`/cart/remove/${bookId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao remover livro do carrinho", error);
    throw error;
  }
};

// Função para limpar o carrinho
export const clearCart = async () => {
  try {
    const response = await axiosInstance.delete("/cart/clear");
    return response.data;
  } catch (error) {
    console.error("Erro ao limpar carrinho", error);
    throw error;
  }
};
