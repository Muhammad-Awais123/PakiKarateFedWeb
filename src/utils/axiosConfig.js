// src/utils/axiosConfig.js
import axios from "axios";
import toast from "react-hot-toast";

const isLocalFrontend =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "");

// If the frontend is running locally, force the local backend URL.
// This prevents `.env.production` from pointing to a remote API and leaving UI empty.
const API_URL = isLocalFrontend
  ? "http://localhost:5000/api"
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const adminPathEnv = import.meta.env.VITE_ADMIN_PATH;
const ADMIN_PATH = adminPathEnv
  ? String(adminPathEnv).startsWith("/")
    ? String(adminPathEnv)
    : `/${String(adminPathEnv)}`
  : "/admin/login";

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

let isHandling401 = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      const hadToken = Boolean(localStorage.getItem("adminToken"));
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminName");

      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      const shouldRedirect = hadToken || currentPath !== ADMIN_PATH;

      if (shouldRedirect && !isHandling401) {
        isHandling401 = true;
        if (hadToken) toast.error("Session expired, please log in again");
        window.location.replace(ADMIN_PATH);
        setTimeout(() => {
          isHandling401 = false;
        }, 3000);
      } else if (hadToken) {
        // If already on login page, still show the message once.
        toast.error("Session expired, please log in again");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;