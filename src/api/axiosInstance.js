// api\axiosInstance.js
import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: 'https://pro-suite-backend.onrender.com/api', // or your backend URL
});

// Add JWT token to every request if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
