import axios from "axios";
import { API_URL } from "./apiUrl";

const axiosInstance = axios.create({
  baseURL: API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

const useAxiosInterceptors = () => {
  let loadingTimeout;

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      clearTimeout(loadingTimeout); 
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      clearTimeout(loadingTimeout); 
      return response;
    },
    (error) => {
      clearTimeout(loadingTimeout);
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
export { useAxiosInterceptors };