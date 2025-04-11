import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';  
import Home from "../pages/Home/Home";
import Header from "../components/Header/Header";
import Register from "../pages/Register/Register";
import Auth from "../pages/Auth/Auth";
import { useAuth } from "../context/authContext"; 

const AppRoutes = () => {
  const { isAuthenticated } = useAuth(); 
  
  const router = createBrowserRouter([
    {
      path: '/inicio',
      element: (
        <>
          <Header />
          <Home />
        </>
      ),
    },
    {
      path: '/cadastro',
      element: isAuthenticated() ? (
        <Navigate to="/inicio" replace />  
      ) : (
        <Register />
      ),
    },
    {
      path: '/auth',
      element: isAuthenticated() ? (
        <Navigate to="/inicio" replace />  
      ) : (
        <Auth />
      ),
    },
    {
      path: '*', 
      element: <Navigate to="/inicio" replace />  
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
