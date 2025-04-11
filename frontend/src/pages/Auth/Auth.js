/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import './Auth.css';
import { login } from '../../services/usuario';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { useLoading } from '../../context/LoadingContext';
import Loading from "../../components/Loading/Loading";

const Auth = () => {
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const data = await login(formData.email, formData.senha);

      toast.success(data.mensagem || 'Autenticação realizada com sucesso!'); 

      setTimeout(() => {
        navigate('/inicio', { replace: true });
      }, 2500); 
    } catch (error) {
      const errorMessage = error.response?.data?.mensagem || 'Erro ao realizar autenticação. Tente novamente.';
      toast.error(errorMessage); 
      setLoading(false); 
    }
  };

  const handleBack = () => {
    navigate(-1); 
  };

  const handleLinkRegister = () => {
    navigate('/cadastro')
  }

  return (
    <>
      {loading ? (
        <Loading/>
      ): (
      <div className="auth-container">
      <button className="back-button" onClick={handleBack}>
        <IoArrowBack size={20} /> 
      </button>
      <h2>Autenticação</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Autenticar</button>
        <div className='link'>
          <p>Não tem uma conta? <a onClick={handleLinkRegister}>Cadastre-se aqui</a></p>
        </div>
      </form>
      </div>
      )}
      </>
  );
};

export default Auth;
