/**
 * MainLayout.jsx — Layout chính cho các trang sau khi đăng nhập
 *
 * Cấu trúc:
 *  ┌────────────┬──────────────────────────┐
 *  │            │   Header (sticky top)    │
 *  │  Sidebar   ├──────────────────────────┤
 *  │  (fixed)   │   <Outlet /> (content)   │
 *  │            │                          │
 *  └────────────┴──────────────────────────┘
 *
 * - Sidebar cố định bên trái (w-64)
 * - Header dính trên cùng
 * - Nội dung trang hiển thị qua <Outlet /> của react-router
 */
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../hooks/useAuth';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ===== Sidebar bên trái ===== */}
      <Sidebar user={user} onLogout={logout} />

      {/* ===== Khu vực chính (Header + Content) ===== */}
      <main className="flex-1 overflow-y-auto bg-bg-light custom-scrollbar">
        {/* Header dính trên */}
        <Header
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />

        {/* Nội dung trang — được render bởi react-router */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
