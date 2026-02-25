/**
 * PublicRoute.jsx — Route công khai (VD: trang login)
 *
 * LUỒNG:
 * 1. Nếu user ĐÃ đăng nhập → redirect về / (Dashboard)
 * 2. Nếu CHƯA đăng nhập → render children (LoginPage)
 *
 * Mục đích: Ngăn user đã đăng nhập quay lại trang login
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/ui/Loading';

export default function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  console.log('[PublicRoute] Kiểm tra trạng thái:', { isAuthenticated, loading });

  if (loading) {
    console.log('[PublicRoute] Đang loading auth, hiện spinner...');
    return <Loading fullScreen text="Đang kiểm tra đăng nhập..." />;
  }

  // Đã đăng nhập → không cho vào login nữa, chuyển về Dashboard
  if (isAuthenticated) {
    console.log('[PublicRoute] User đã đăng nhập, redirect về / (Dashboard)');
    return <Navigate to="/" replace />;
  }

  console.log('[PublicRoute] User chưa đăng nhập, render children (LoginPage)');
  return children;
}
