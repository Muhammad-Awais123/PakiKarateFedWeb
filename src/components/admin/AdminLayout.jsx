import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

function getAdminLoginPath() {
  const adminPathEnv = import.meta.env.VITE_ADMIN_PATH;
  return adminPathEnv
    ? String(adminPathEnv).startsWith("/")
      ? String(adminPathEnv)
      : `/${String(adminPathEnv)}`
    : "/admin/login";
}

function getSectionTitle(pathname) {
  const p = pathname || "";
  if (p === "/admin/dashboard" || p.endsWith("/admin/dashboard"))
    return "Dashboard Overview";
  if (p.includes("/admin/dashboard/events")) return "Events";
  if (p.includes("/admin/dashboard/schedule")) return "Schedule";
  if (p.includes("/admin/dashboard/registrations")) return "Registrations";
  if (p.includes("/admin/dashboard/rankings")) return "Rankings";
  if (p.includes("/admin/dashboard/players")) return "Players";
  if (p.includes("/admin/dashboard/coaches")) return "Coaches";
  if (p.includes("/admin/dashboard/legends")) return "Legends";
  return "Admin";
}

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const v = localStorage.getItem("sidebarCollapsed");
    return v === "true";
  });
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const adminName = localStorage.getItem("adminName") || "Admin";
  const ADMIN_PATH = useMemo(() => getAdminLoginPath(), []);
  const sectionTitle = useMemo(
    () => getSectionTitle(location.pathname),
    [location.pathname]
  );

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate(ADMIN_PATH);
  };

  const sidebarWidth = sidebarCollapsed ? 60 : 240;

  return (
    <div
      className="min-h-screen bg-gray-100 dark:bg-black lg:overflow-hidden"
      style={{ ["--sidebar-w"]: `${sidebarWidth}px` }}
    >
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
        mobileOpen={mobileNavOpen}
        onMobileOpenChange={setMobileNavOpen}
      />

      <div className="flex flex-col lg:ml-[var(--sidebar-w)]">
        <div className="sticky top-0 z-30 bg-gray-100/95 dark:bg-black/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-200"
              aria-label="Open menu"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0">
              <div className="text-base font-bold text-gray-900 dark:text-zinc-50 truncate">
                {sectionTitle}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                {adminName}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#008000] text-white font-semibold hover:bg-green-700"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;