import axiosInstance from "../config/axiosConfig";

// Função para buscar um livro por ID
export const getBook = async (bookId) => {
  try {
    const response = await axiosInstance.get(`/livros/${bookId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar livro", error);
    throw error;
  }
};

// Função para listar todos os livros
export const getAllBooks = async () => {
  try {
    const response = await axiosInstance.get("/livros");
    return response.data;
  } catch (error) {
    console.error("Erro ao listar livros", error);
    throw error;
  }
};

// Função para listar livros por categoria com paginação
export const getBooksByCategory = async (categoria, pagina = 1) => {
  try {
    const response = await axiosInstance.get("/livros/categoria", {
      params: { categoria, pagina },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao listar livros por categoria", error);
    throw error;
  }
};
