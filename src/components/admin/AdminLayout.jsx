import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-6 bg-gray-100 dark:bg-black">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;