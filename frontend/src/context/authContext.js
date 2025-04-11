import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        const currentTime = Date.now() / 1000; 
        if (decoded.exp < currentTime) {
          sessionStorage.removeItem('access_token'); 
          setUser(null); 
          toast.error('Sua sessão expirou. Por favor, faça login novamente.');
        } else {
          setUser(decoded); 
        }
      }
    }
  }, []); 

  const isAuthenticated = () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) return false;

    const decoded = decodeToken(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      sessionStorage.removeItem('access_token');
      setUser(null);
      toast.error('Sua sessão expirou. Por favor, faça login novamente.');
      return false;
    }

    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
