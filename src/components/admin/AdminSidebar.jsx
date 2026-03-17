import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
      <NavLink
        to="/admin/dashboard/events"
        className={({ isActive }) =>
          `mb-2 p-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
        }
      >
        Events Management
      </NavLink>
      <NavLink
        to="/admin/dashboard/rankings"
        className={({ isActive }) =>
          `mb-2 p-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
        }
      >
        World Rankings
      </NavLink>
      <NavLink
        to="/admin/dashboard/registrations"
        className={({ isActive }) =>
          `mb-2 p-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
        }
      >
        Event Registrations
      </NavLink>
    </div>
  );
};

export default AdminSidebar;