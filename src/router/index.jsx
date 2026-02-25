/**
 * router/index.jsx — Cấu hình Router tập trung
 *
 * Tách riêng cấu hình routing ra khỏi App.jsx
 * để dễ quản lý khi thêm route mới.
 *
 * CẤU TRÚC:
 *   /login          → LoginPage       (trang công khai)
 *   /               → MainLayout      (cần đăng nhập)
 *     ├── /         → DashboardPage
 *     ├── /users    → UsersPage
 *     └── /*        → Redirect về /
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UsersPage from '../pages/UsersPage';

/**
 * PlaceholderPage — Trang tạm cho các chức năng chưa phát triển
 */
function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
      <span className="material-icons text-6xl mb-4">construction</span>
      <h2 className="text-xl font-semibold text-slate-600">Trang {title}</h2>
      <p className="text-sm mt-2">Chức năng đang được phát triển...</p>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      {/* ===== PUBLIC: Trang đăng nhập ===== */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* ===== PROTECTED: Các trang cần đăng nhập ===== */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard — trang mặc định */}
        <Route index element={<DashboardPage />} />

        {/* Quản lý người dùng */}
        <Route path="users" element={<UsersPage />} />

        {/* Các route chưa có → placeholder */}
        <Route path="products" element={<PlaceholderPage title="Sản phẩm" />} />
        <Route path="import" element={<PlaceholderPage title="Nhập kho" />} />
        <Route path="export" element={<PlaceholderPage title="Xuất kho" />} />
        <Route path="inventory" element={<PlaceholderPage title="Tồn kho" />} />
        <Route path="suppliers" element={<PlaceholderPage title="Nhà cung cấp" />} />
        <Route path="reports" element={<PlaceholderPage title="Báo cáo" />} />
        <Route path="settings" element={<PlaceholderPage title="Cài đặt" />} />

        {/* Catch-all: redirect về Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
