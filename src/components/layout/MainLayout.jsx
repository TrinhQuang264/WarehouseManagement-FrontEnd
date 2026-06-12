import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "../../features/auth/hooks/useAuth.jsx";
import ToastContainer from "../ui/ToastContainer";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === "/";

  return (
    <div className="layout-wrapper">
      <ToastContainer />
      <Sidebar user={user} onLogout={logout} />
      <main className="main-content">
        {!isDashboard && <Header />}
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
