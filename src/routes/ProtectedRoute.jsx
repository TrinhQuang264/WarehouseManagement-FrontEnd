import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth.jsx';
import Loading from '../components/ui/Loading';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Đang kiểm tra đăng nhập..." />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
