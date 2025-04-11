import React, { useState } from 'react';
import './Register.css';
import { register } from '../../services/usuario';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5'; 
import { useLoading } from '../../context/LoadingContext';
import Loading from "../../components/Loading/Loading";

const Register = () => {
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();

  const [formData, setFormData] = useState({
    nome: '',
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
      const data = await register(formData.nome, formData.email, formData.senha);

      toast.success(data.mensagem || 'Cadastro realizado com sucesso!'); 

      setTimeout(() => {
        navigate('/inicio', { replace: true });
      }, 2500); 
    } catch (error) {
      const errorMessage = error.response?.data?.mensagem || 'Erro ao cadastrar usuário. Tente novamente.';
      toast.error(errorMessage); 
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <>
    {loading ? (
      <Loading/>
    ) : (
    <div className="register-container">
      <button className="back-button" onClick={handleBack}>
        <IoArrowBack size={20} /> 
      </button>
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Seu nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
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
        <button type="submit">Cadastrar</button>
      </form>
    </div>
    )}
    </>
  );
};

export default Register;
