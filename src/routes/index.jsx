import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Loading from "../components/ui/Loading";

<<<<<<< HEAD
const MainLayout = lazy(() => import("../components/layout/MainLayout"));
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const DashboardPage = lazy(() => import("../features/dashboard/components/DashboardPage"));
const UsersPage = lazy(() => import("../features/users/components/UsersPage"));
const ProductsPage = lazy(() => import("../features/products/pages/ProductsPage"));
const CategoriesPage = lazy(() => import("../features/categories/pages/CategoriesPage"));
const InventoryPage = lazy(() => import("../features/inventory/components/InventoryPage"));
const ImportsPage = lazy(() => import("../features/imports/pages/ImportsPage"));
const ExportsPage = lazy(() => import("../features/exports/pages/ExportsPage"));
const SuppliersPage = lazy(() => import("../features/suppliers/pages/SuppliersPage"));
const CustomersPage = lazy(() => import("../features/customers/components/CustomersPage"));
const ProfilePage = lazy(() => import("../features/profile/pages/ProfilePage"));
const SettingsPage = lazy(() => import("../features/settings/components/SettingsPage"));
const ReportsPage = lazy(() => import("../features/reports/pages/ReportsPage"));
=======
// Lazy load components for code splitting and faster initial load
const MainLayout = lazy(() => import('../components/layout/MainLayout'));
const LoginPage = lazy(() => import('../features/auth/components/LoginPage'));
const DashboardPage = lazy(() => import('../features/dashboard/components/DashboardPage'));
const UsersPage = lazy(() => import('../features/users/components/UsersPage'));
const ProductsPage = lazy(() => import('../features/products/components/ProductsPage'));
const CategoriesPage = lazy(() => import('../features/categories/components/CategoriesPage'));
const InventoryPage = lazy(() => import('../features/inventory/components/InventoryPage'));
const SuppliersPage = lazy(() => import('../features/suppliers/components/SuppliersPage'));
const CustomersPage = lazy(() => import('../features/customers/components/CustomersPage'));
const ProfilePage = lazy(() => import('../features/profile/components/ProfilePage'));
const SettingsPage = lazy(() => import('../features/settings/components/SettingsPage'));

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
>>>>>>> 3a5566f739b6b8c84db6d85232bb921ac357dbbf

export default function AppRouter() {
  return (
    <Suspense fallback={<Loading text="Đang tải giao diện..." />}>
      <Routes>
<<<<<<< HEAD
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductsPage />} />
          <Route path="products/edit/:id" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="import" element={<ImportsPage />} />
          <Route path="import/new" element={<ImportsPage />} />
          <Route path="import/edit/:id" element={<ImportsPage />} />
          <Route path="import/:id" element={<ImportsPage />} />
          <Route path="export" element={<ExportsPage />} />
          <Route path="export/new" element={<ExportsPage />} />
          <Route path="export/edit/:id" element={<ExportsPage />} />
          <Route path="export/:id" element={<ExportsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="suppliers/:id" element={<SuppliersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:id" element={<CustomersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
=======
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
>>>>>>> 3a5566f739b6b8c84db6d85232bb921ac357dbbf
    </Suspense>
  );
}
