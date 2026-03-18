import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Smartphone,
  Download,
  Upload,
  Package,
  Store,
  BarChart3,
  Users,
  Settings,
  LogOut,
  FolderTree,
  Users2
} from 'lucide-react';
import Avatar from '../ui/Avatar';

// Danh sách menu chính
const mainMenu = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Smartphone, label: 'Sản phẩm' },
  { to: '/categories', icon: FolderTree, label: 'Danh mục' },
  { to: '/import', icon: Download, label: 'Nhập kho' },
  { to: '/export', icon: Upload, label: 'Xuất kho' },
  { to: '/inventory', icon: Package, label: 'Tồn kho' },
  { to: '/suppliers', icon: Store, label: 'Nhà cung cấp' },
  { to: '/customers', icon: Users2, label: 'Khách hàng' },
];

// Danh sách menu hệ thống
const systemMenu = [
  { to: '/reports', icon: BarChart3, label: 'Báo cáo' },
  { to: '/users', icon: Users, label: 'Người dùng' },
  { to: '/settings', icon: Settings, label: 'Cài đặt' },
];

export default function Sidebar({ user, onLogout }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo-container">
        <div className="sidebar-logo-icon">
          <span className="material-icons">inventory_2</span>
        </div>
        <span className="sidebar-logo-text">
          WareSmart
        </span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Menu chính */}
        {mainMenu.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}

        {/* Phân cách hệ thống */}
        <div className="sidebar-section-title">
          Hệ thống
        </div>

        {/* Menu hệ thống */}
        {systemMenu.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}
      </nav>

      {/* User Info */}
      <div className="sidebar-user">
        <div className="flex items-center gap-3 px-2 py-2">
          <Link to="/profile" className="flex items-center gap-3 flex-1 overflow-hidden group cursor-pointer">
            <Avatar
              src={user?.avatar}
              name={user?.fullName || 'User'}
              size="md"
            />
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold truncate text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                {user?.fullName || 'Người dùng'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.role || 'Nhân viên'}
              </p>
            </div>
          </Link>
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-accent-red transition-colors p-1"
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
      end={item.to === '/'}
      className={({ isActive }) =>
        `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
      }
    >
      <Icon size={20} />
      {item.label}
    </NavLink>
  );
