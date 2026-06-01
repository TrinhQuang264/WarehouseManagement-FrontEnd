import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth.jsx';
import Loading from '../components/ui/Loading';

export default function PublicRoute({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();

  // Chờ AuthProvider hydrate để tránh nháy điều hướng sai lúc reload.
  if (!isInitialized) {
    return <Loading fullScreen text="Đang kiểm tra đăng nhập..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}
