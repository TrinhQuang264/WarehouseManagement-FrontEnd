import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Loading from "../components/ui/Loading";

const MainLayout = lazy(() => import("../components/layout/MainLayout"));
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const DashboardPage = lazy(
    () => import("../features/dashboard/components/DashboardPage"),
);
const UsersPage = lazy(() => import("../features/users/pages/UsersPage"));
const ProductsPage = lazy(
    () => import("../features/products/pages/ProductsPage"),
);
const CategoriesPage = lazy(
    () => import("../features/categories/pages/CategoriesPage"),
);
const InventoryPage = lazy(
    () => import("../features/inventory/components/InventoryPage"),
);
const ImportsPage = lazy(() => import("../features/imports/pages/ImportsPage"));
const ExportsPage = lazy(() => import("../features/exports/pages/ExportsPage"));
const SuppliersPage = lazy(
    () => import("../features/suppliers/pages/SuppliersPage"),
);
const CustomersPage = lazy(
    () => import("../features/customers/pages/CustomersPage"),
);
const ProfilePage = lazy(() => import("../features/profile/pages/ProfilePage"));
const ReportsPage = lazy(() => import("../features/reports/pages/ReportsPage"));

export default function AppRouter() {
    return (
        <Suspense fallback={<Loading text="Đang tải giao diện..." />}>
            <Routes>
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
                    <Route path="products/create" element={<ProductsPage />} />
                    <Route
                        path="products/update/:id"
                        element={<ProductsPage />}
                    />
                    <Route path="products/:id" element={<ProductsPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route
                        path="categories/create"
                        element={<CategoriesPage />}
                    />
                    <Route
                        path="categories/update/:id"
                        element={<CategoriesPage />}
                    />
                    <Route path="categories/:id" element={<CategoriesPage />} />
                    <Route path="import" element={<ImportsPage />} />
                    <Route path="import/create" element={<ImportsPage />} />
                    <Route path="import/update/:id" element={<ImportsPage />} />
                    <Route path="import/:id" element={<ImportsPage />} />
                    <Route path="export" element={<ExportsPage />} />
                    <Route path="export/create" element={<ExportsPage />} />
                    <Route path="export/update/:id" element={<ExportsPage />} />
                    <Route path="export/:id" element={<ExportsPage />} />
                    <Route path="inventory" element={<InventoryPage />} />
                    <Route path="suppliers" element={<SuppliersPage />} />
                    <Route path="suppliers/:id" element={<SuppliersPage />} />
                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="customers/:id" element={<CustomersPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
