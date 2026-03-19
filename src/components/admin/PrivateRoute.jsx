import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("adminToken");
  const adminPathEnv = import.meta.env.VITE_ADMIN_PATH;
  const ADMIN_PATH = adminPathEnv
    ? String(adminPathEnv).startsWith("/")
      ? String(adminPathEnv)
      : `/${String(adminPathEnv)}`
    : "/admin/login";

  if (!token) return <Navigate to={ADMIN_PATH} replace />;
  return <Outlet />;
};

export default PrivateRoute;

