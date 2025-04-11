/* eslint-disable react-hooks/rules-of-hooks */
import axiosInstance from "../config/axiosConfig";
import { toast } from 'react-toastify';


// Função para login de usuário
export const login = async (email, senha) => {
  try {
    const response = await axiosInstance.post("/usuarios/auth", { email, senha });
    sessionStorage.setItem("access_token", response.data.access_token);
    return response.data;
  } catch (error) {
    console.error("Erro no login", error);
    throw error;
  }
};

// Função para cadastro de novo usuário
export const register = async (nome, email, senha) => {
  try {
    const response = await axiosInstance.post("/usuarios/cadastrar", {
      nome,
      email,
      senha,
    });
    return response.data;
  } catch (error) {
    console.error("Erro no cadastro", error);
    throw error;
  }
};

// Função para deletar usuário
export const deleteUser = async (usuarioId) => {
  try {
    const response = await axiosInstance.delete(`/usuarios/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar usuário", error);
    throw error;
  }
};

// Função para realizer logout do usuário
export const logout = async () => {
  try {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      sessionStorage.removeItem('access_token');
    } else {
      toast.error("Você precisa estar logado para realizar essa ação."); 
    }
  } catch (error) {
    console.error("Erro ao realizar logout", error);
    toast.error("Você precisa estar logado para realizar essa ação."); 
  }
};
