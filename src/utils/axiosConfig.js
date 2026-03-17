// src/utils/axiosConfig.js
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Change if deployed

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add JWT token automatically
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;