import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth.jsx';
import Loading from '../components/ui/Loading';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();

  // Chờ AuthProvider hydrate từ localStorage trước khi quyết định redirect.
  if (!isInitialized) {
    return <Loading fullScreen text="Đang kiểm tra đăng nhập..." />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
