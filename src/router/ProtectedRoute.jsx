/**
 * ProtectedRoute.jsx — Bảo vệ các trang cần đăng nhập
 *
 * LUỒNG:
 * 1. Kiểm tra isAuthenticated từ useAuth()
 * 2. Đang loading → hiện spinner
 * 3. Chưa đăng nhập → redirect về /login
 * 4. Đã đăng nhập → render children
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/ui/Loading';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  console.log('[ProtectedRoute] Kiểm tra trạng thái:', { isAuthenticated, loading });

  // Đang kiểm tra auth → hiện loading
  if (loading) {
    console.log('[ProtectedRoute] Đang loading auth, hiện spinner...');
    return <Loading fullScreen text="Đang kiểm tra đăng nhập..." />;
  }

  // Chưa đăng nhập → chuyển về trang login
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Chưa đăng nhập, redirect về /login');
    return <Navigate to="/login" replace />;
  }

  // Đã đăng nhập → hiển thị trang
  console.log('[ProtectedRoute] Đã đăng nhập, render children (Dashboard/MainLayout)');
  return children;
}
