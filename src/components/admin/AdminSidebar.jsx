import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "../../utils/axiosConfig.js";
import {
  CalendarDays,
  Clock,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Home,
  Star,
  Trophy,
  User,
  Megaphone,
} from "lucide-react";

function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

const SidebarNav = ({
  showText,
  pendingRegistrationsCount,
  onNavigate,
}) => {
  const nav = useMemo(
    () => [
      { to: "/admin/dashboard", label: "Dashboard Overview", Icon: Home, showBadge: false },
      { to: "/admin/dashboard/events", label: "Events", Icon: CalendarDays, showBadge: false },
      { to: "/admin/dashboard/schedule", label: "Schedule", Icon: Clock, showBadge: false },
      {
        to: "/admin/dashboard/registrations",
        label: "Registrations",
        Icon: ClipboardList,
        showBadge: true,
      },
      { to: "/admin/dashboard/rankings", label: "Rankings", Icon: Trophy, showBadge: false },
      { to: "/admin/dashboard/players", label: "Players", Icon: User, showBadge: false },
      { to: "/admin/dashboard/coaches", label: "Coaches", Icon: Megaphone, showBadge: false },
      { to: "/admin/dashboard/legends", label: "Legends", Icon: Star, showBadge: false },
    ],
    []
  );

  return (
    <nav className="flex-1">
      {nav.map(({ to, label, Icon, showBadge }) => {
        return (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin/dashboard"}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 mb-2 px-2 py-2 rounded-xl transition",
                isActive
                  ? "bg-white/10 border-l-4 border-[#008000] pl-[9px]"
                  : "hover:bg-white/5 border-l-4 border-transparent"
              )
            }
          >
            {React.createElement(Icon, { size: 18, className: "shrink-0" })}
            {showText ? (
              <span className="text-sm font-semibold truncate">{label}</span>
            ) : null}

            {showBadge ? (
              pendingRegistrationsCount > 0 ? (
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-full bg-[#008000] text-white text-xs font-bold",
                    showText ? "ml-auto px-2 py-0.5" : "ml-auto px-1.5 py-0.5 text-[10px]"
                  )}
                >
                  {pendingRegistrationsCount}
                </span>
              ) : null
            ) : null}
          </NavLink>
        );
      })}
    </nav>
  );
};

const SidebarShell = ({
  collapsed,
  onToggleCollapsed,
  showText,
  pendingRegistrationsCount,
  onNavigate,
  showCollapseToggle = true,
}) => {
  const adminName = localStorage.getItem("adminName") || "Admin";

  return (
    <div
      className={cn(
        "bg-gray-800 text-white min-h-screen flex flex-col border-r border-gray-700",
        showText ? "p-4" : "p-3"
      )}
      style={{ width: collapsed ? 60 : 240 }}
    >
      <div
        className={cn(
          "flex items-center gap-3 mb-5",
          showText ? "" : "justify-center"
        )}
      >
        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-[#00ff66]">
          PKF
        </div>
        {showText ? (
          <div className="min-w-0">
            <div className="text-base font-bold truncate">Welcome, {adminName}</div>
            <div className="text-xs text-gray-300 truncate">Admin Control Panel</div>
          </div>
        ) : null}
      </div>

      {showCollapseToggle ? (
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="inline-flex items-center justify-center rounded-xl border border-gray-700 text-gray-200 hover:border-gray-500 hover:bg-white/5 p-2 mb-4"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      ) : null}

      <SidebarNav
        showText={showText}
        pendingRegistrationsCount={pendingRegistrationsCount}
        onNavigate={onNavigate}
      />

      <div className="pt-3 border-t border-gray-700">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          onClick={onNavigate}
          className="group flex items-center gap-3 mb-1 px-2 py-2 rounded-xl hover:bg-white/5"
        >
          <ExternalLink size={18} className="shrink-0" />
          {showText ? (
            <span className="text-sm font-semibold truncate">
              View Public Site
            </span>
          ) : null}
        </a>
      </div>
    </div>
  );
};

const AdminSidebar = ({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onMobileOpenChange,
}) => {
  const [pendingRegistrationsCount, setPendingRegistrationsCount] = useState(0);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        const res = await axios.get("/admin/registrations");
        const list = Array.isArray(res?.data?.data) ? res.data.data : [];
        const pending = list.filter((r) => r?.status === "pending").length;
        if (alive) setPendingRegistrationsCount(pending);
      } catch {
        if (alive) setPendingRegistrationsCount(0);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, []);

  const onNavigate = () => {
    if (mobileOpen) onMobileOpenChange(false);
  };

  return (
    <>
      {/* Desktop fixed sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40">
        <SidebarShell
          collapsed={collapsed}
          onToggleCollapsed={onToggleCollapsed}
          showText={!collapsed}
          pendingRegistrationsCount={pendingRegistrationsCount}
          onNavigate={onNavigate}
          showCollapseToggle
        />
      </div>

      {/* Mobile overlay */}
      {mobileOpen ? (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/40"
            onClick={() => onMobileOpenChange(false)}
            aria-hidden
          />
          <div className="lg:hidden fixed inset-y-0 left-0 z-[60]">
            <SidebarShell
              collapsed={false}
              onToggleCollapsed={() => {}}
              showText={true}
              pendingRegistrationsCount={pendingRegistrationsCount}
              onNavigate={onNavigate}
              showCollapseToggle={false}
            />
          </div>
        </>
      ) : null}
    </>
  );
};

export default AdminSidebar;