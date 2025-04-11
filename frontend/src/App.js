import React from "react";
import { AuthProvider } from "./context/authContext";
import { CartProvider } from "./context/CartContext";
import AppRoutes from "./routes/routes";
import { LoadingProvider } from "./context/LoadingContext"; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAxiosInterceptors } from "./config/axiosConfig";

const App = () => {

  return (
    <AuthProvider>
      <LoadingProvider> 
        <CartProvider>
          <AppContent />
        </CartProvider>
      </LoadingProvider>
    </AuthProvider>
  );
};

const AppContent = () => {
  useAxiosInterceptors();

  return (
    <div>
  
      <AppRoutes />
      
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeButton={false}
        newestOnTop={true} 
        pauseOnHover={false}      
        pauseOnFocusLoss={false} 
      />
    </div>
  );
};

export default App;
