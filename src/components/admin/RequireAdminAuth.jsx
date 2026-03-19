import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAdminAuth = () => {
  const location = useLocation();
  const token = localStorage.getItem("adminToken");

  const adminPathEnv = import.meta.env.VITE_ADMIN_PATH;
  const ADMIN_PATH = adminPathEnv
    ? String(adminPathEnv).startsWith("/")
      ? String(adminPathEnv)
      : `/${String(adminPathEnv)}`
    : "/admin/login";

  if (!token) {
    return (
      <Navigate
        to={ADMIN_PATH}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export default RequireAdminAuth;

