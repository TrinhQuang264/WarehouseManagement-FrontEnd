import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Smartphone,
  Download,
  Upload,
  Package,
  Store,
  BarChart3,
  Users,
  LogOut,
  FolderTree,
  Users2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

// Danh sách menu chính
const mainMenu = [
  { to: "/", icon: LayoutDashboard, label: "Tổng quan" },
  { to: "/import", icon: Download, label: "Nhập kho" },
  { to: "/export", icon: Upload, label: "Xuất kho" },
  { to: "/inventory", icon: Package, label: "Tồn kho" },
];

const managerMenu = [
  { to: "/products", icon: Smartphone, label: "Sản phẩm" },
  { to: "/categories", icon: FolderTree, label: "Danh mục" },
  { to: "/customers", icon: Users2, label: "Khách hàng" },
  { to: "/suppliers", icon: Store, label: "Nhà cung cấp" },
];

// Danh sách menu hệ thống
const systemMenu = [
  { to: "/users", icon: Users, label: "Người dùng" },
  { to: "/reports", icon: BarChart3, label: "Báo cáo" },
];

export default function Sidebar({ user, onLogout }) {
  // Lấy trạng thái từ localStorage khi load trang
  const [expandedSections, setExpandedSections] = useState(() => {
    const saved = localStorage.getItem("sidebar-expanded");

    return saved
      ? JSON.parse(saved)
      : {
          manager: false,
          system: false,
        };
  });

  // Tự động lưu mỗi khi state thay đổi
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", JSON.stringify(expandedSections));
  }, [expandedSections]);

  // Toggle mở/đóng section
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo-container">
        <div className="sidebar-logo-icon">
          <span className="material-icons">inventory_2</span>
        </div>
        <span className="sidebar-logo-text">WareSmart</span>
      </div>

      <nav className="sidebar-nav">
        {/* Menu chính */}
        {mainMenu.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}

        {/* Quản lý */}
        <div
          className="sidebar-section-title flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("manager")}
          aria-expanded={expandedSections.manager}
        >
          <span>Quản lý</span>

          <span className="icon-box">
            {expandedSections.manager ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </span>
        </div>

        {expandedSections.manager &&
          managerMenu.map((item) => <SidebarLink key={item.to} item={item} />)}

        {/* Hệ thống */}
        <div
          className="sidebar-section-title flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("system")}
          aria-expanded={expandedSections.system}
        >
          <span>Hệ thống</span>

          <span className="icon-box">
            {expandedSections.system ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </span>
        </div>

        {expandedSections.system &&
          systemMenu.map((item) => <SidebarLink key={item.to} item={item} />)}
      </nav>

      {/* User Info */}
      <div className="sidebar-user">
        <div className="flex items-center gap-3 px-2 py-2">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 flex-1 overflow-hidden group cursor-pointer p-2 rounded-lg transition-all ${
                isActive
                  ? "bg-primary/10 text-primary border-l-4 border-primary"
                  : "hover:bg-slate-100"
              }`
            }
          >
            <div className="overflow-hidden flex-1">
              <p
                className={`text-sm font-semibold truncate transition-colors ${
                  user?.role ? "text-slate-900" : "text-primary"
                }`}
              >
                {user?.fullName ||
                  (user?.lastName && user?.firstName
                    ? `${user.lastName} ${user.firstName}`
                    : null) ||
                  user?.userName ||
                  "Người dùng"}
              </p>

              <p className="text-xs text-slate-500 truncate">
                {user?.role || "Nhân viên"}
              </p>
            </div>
          </NavLink>

          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-red-500 transition-colors p-1"
            title="Đăng xuất"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      className={({ isActive }) =>
        `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
      }
    >
      <Icon size={20} />
      <span>{item.label}</span>
    </NavLink>
  );
}
