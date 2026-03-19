import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import Loading from '../components/ui/Loading';

// Lazy load components for code splitting and faster initial load
const MainLayout = lazy(() => import('../components/layout/MainLayout'));
const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage/DashboardPage'));
const UsersPage = lazy(() => import('../pages/UsersPage/UsersPage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage/ProductsPage'));
const CategoriesPage = lazy(() => import('../pages/CategoriesPage/CategoriesPage'));
const InventoryPage = lazy(() => import('../pages/InventoryPage/InventoryPage'));
const SuppliersPage = lazy(() => import('../pages/Suppliers/SuppliersPage'));
const CustomersPage = lazy(() => import('../pages/Customers/CustomersPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

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
    <Suspense fallback={<Loading text="Đang tải giao diện..." />}>
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

        {/* Quản lý sản phẩm & danh mục */}
        <Route path="products" element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="import" element={<PlaceholderPage title="Nhập kho" />} />
        <Route path="export" element={<PlaceholderPage title="Xuất kho" />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="reports" element={<PlaceholderPage title="Báo cáo" />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />

        {/* Catch-all: redirect về Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    </Suspense>
  );
}
