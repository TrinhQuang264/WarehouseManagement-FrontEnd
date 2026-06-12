import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../features/auth/hooks/useAuth.jsx';
import ToastContainer from '../ui/ToastContainer';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  return (
    <div className="layout-wrapper">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Sidebar bên trái */}
      <Sidebar user={user} onLogout={logout} />

      {/* Khu vực chính (Header + Content) */}
      <main className="main-content">
        {/* Header dính trên (Ẩn ở trang Dashboard) */}
        {!isDashboard && <Header />}

        {/* Nội dung trang — được render bởi react-router */}
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
