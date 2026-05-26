import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
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
  PanelLeftClose,
  PanelRightClose,
  UserCircle2,
} from "lucide-react";
import "../../styles/slidebar.css";

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

const systemMenu = [
  { to: "/users", icon: Users, label: "Người dùng" },
  { to: "/reports", icon: BarChart3, label: "Báo cáo" },
];

// ─── Tooltip — render qua Portal vào document.body ───────────────────────────
function Tooltip({ label, anchorEl, visible }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    setPos({
      top: rect.top + rect.height / 2,
      left: rect.right + 10,
    });
  }, [anchorEl, visible]);

  return createPortal(
    <div
      className={`sidebar-tooltip ${visible ? "visible" : "hidden"}`}
      style={{ top: pos.top, left: pos.left }}
    >
      {label}
    </div>,
    document.body,
  );
}

// ─── Hook hover + anchor ref ──────────────────────────────────────────────────
function useTooltip() {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };
  return { ref, hovered, handlers };
}

// ─── Icon link (collapsed) ────────────────────────────────────────────────────
function CollapsedLink({ item }) {
  const Icon = item.icon;
  const { ref, hovered, handlers } = useTooltip();

  return (
    <>
      <NavLink
        ref={ref}
        to={item.to}
        end={item.to === "/"}
        {...handlers}
        className={({ isActive }) =>
          `sidebar-collapsed-icon${isActive ? " sidebar-link-active" : ""}`
        }
      >
        <Icon size={20} />
      </NavLink>
      <Tooltip label={item.label} anchorEl={ref.current} visible={hovered} />
    </>
  );
}

// ─── Profile icon (collapsed) ─────────────────────────────────────────────────
function CollapsedProfile({ user }) {
  const { ref, hovered, handlers } = useTooltip();
  const label =
    user?.fullName ||
    (user?.lastName && user?.firstName
      ? `${user.lastName} ${user.firstName}`
      : null) ||
    user?.userName ||
    "Hồ sơ";

  return (
    <>
      <NavLink
        ref={ref}
        to="/profile"
        {...handlers}
        className={({ isActive }) =>
          `sidebar-collapsed-icon${isActive ? " sidebar-link-active" : ""}`
        }
      >
        <UserCircle2 size={22} />
      </NavLink>
      <Tooltip label={label} anchorEl={ref.current} visible={hovered} />
    </>
  );
}

// ─── Logout icon (collapsed) ─────────────────────────────────────────────────
function CollapsedLogout({ onLogout }) {
  const { ref, hovered, handlers } = useTooltip();

  return (
    <>
      <button
        ref={ref}
        onClick={onLogout}
        {...handlers}
        className="sidebar-collapsed-icon sidebar-logout-icon"
      >
        <LogOut size={20} />
      </button>
      <Tooltip label="Đăng xuất" anchorEl={ref.current} visible={hovered} />
    </>
  );
}

// ─── Nav link đầy đủ (expanded) ──────────────────────────────────────────────
function SidebarLink({ item }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      className={({ isActive }) =>
        `sidebar-link${isActive ? " sidebar-link-active" : ""}`
      }
    >
      <Icon size={20} />
      <span>{item.label}</span>
    </NavLink>
  );
}

// ─── Sidebar chính ────────────────────────────────────────────────────────────
export default function Sidebar({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sidebar-collapsed")) ?? false;
    } catch {
      return false;
    }
  });

  const [expandedSections, setExpandedSections] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("sidebar-expanded")) ?? {
          manager: false,
          system: false,
        }
      );
    } catch {
      return { manager: false, system: false };
    }
  });

  // Thêm class "sidebar-ready" sau khi mount để bật transition width
  // → tránh animation chạy lúc load trang
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", JSON.stringify(expandedSections));
  }, [expandedSections]);

  const toggleSection = useCallback((section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const toggleCollapse = useCallback(() => setCollapsed((prev) => !prev), []);

  const shellClass = [
    "sidebar",
    "sidebar-shell",
    collapsed ? "collapsed" : "expanded",
    ready ? "sidebar-ready" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={shellClass}>
      {/* ── HEADER ── */}
      <div className="sidebar-header">
        <div className="sidebar-logo-area">
          <div className="sidebar-logo-icon">
            <span className="material-icons">inventory_2</span>
          </div>
          <span className="sidebar-logo-text">WareSmart</span>
        </div>

        <button
          className="sidebar-collapse-btn"
          onClick={toggleCollapse}
          title={collapsed ? "Mở thanh điều hướng" : "Thu gọn"}
        >
          {collapsed ? (
            <PanelRightClose size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* ── EXPANDED ── */}
      <div className="sidebar-expanded-content">
        <nav className="sidebar-nav" style={{ flex: 1, overflowY: "auto" }}>
          {mainMenu.map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}

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
            managerMenu.map((item) => (
              <SidebarLink key={item.to} item={item} />
            ))}

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

        {/* User info */}
        <div className="sidebar-user">
          <div className="flex items-center gap-3 px-2 py-2">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 flex-1 overflow-hidden cursor-pointer p-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                    : "hover:bg-slate-100"
                }`
              }
            >
              <div className="overflow-hidden flex-1">
                <p
                  className={`text-sm font-semibold truncate ${
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
      </div>

      {/* ── COLLAPSED ── */}
      <div className="sidebar-collapsed-content">
        <div className="sidebar-divider" />
        {mainMenu.map((item) => (
          <CollapsedLink key={item.to} item={item} />
        ))}
        <div className="sidebar-divider" />
        {managerMenu.map((item) => (
          <CollapsedLink key={item.to} item={item} />
        ))}
        <div className="sidebar-divider" />
        {systemMenu.map((item) => (
          <CollapsedLink key={item.to} item={item} />
        ))}
        <div className="sidebar-spacer" />
        <div className="sidebar-divider" />
        <CollapsedProfile user={user} />
        <CollapsedLogout onLogout={onLogout} />
      </div>
    </aside>
  );
}
