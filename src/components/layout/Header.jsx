import { Bell, HelpCircle } from 'lucide-react';
import Breadcrumbs from '../ui/Breadcrumbs';

export default function Header() {
  return (
    <header className="header">
      // Breadcrumbs thay cho Ô tìm kiếm
      <Breadcrumbs />

      // Các nút hành động bên phải
      <div className="header-actions">
        // Nút trợ giúp
        <button className="header-icon-btn" title="Trợ giúp">
          <HelpCircle size={20} />
        </button>

        // Nút thông báo - Chuyển ra ngoài cùng bên phải
        <button className="header-icon-btn relative" title="Thông báo">
          <Bell size={20} />
          // Chấm đỏ báo có thông báo mới
          <span className="notification-badge" />
        </button>
      </div>
    </header>
  );
}
