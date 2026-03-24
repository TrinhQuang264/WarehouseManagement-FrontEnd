import { Bell, HelpCircle, Search } from 'lucide-react';
import { useHeader } from '../../contexts/HeaderContext';
import SearchBar from '../ui/SearchBar';
import Button from '../ui/Button';

export default function Header() {
  const { searchValue, setSearchValue, actionButton, onSearch, title, subtitle } = useHeader();

  const handleSearchChange = (value) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className="header">
      {/* Breadcrumbs thay cho Ô tìm kiếm */}
      <Breadcrumbs />

      {/* Các nút hành động bên phải */}
      <div className="header-actions">
        {/* Nút trợ giúp */}
        <button className="header-icon-btn" title="Trợ giúp">
          <HelpCircle size={20} />
        </button>

        {/* Nút thông báo - Chuyển ra ngoài cùng bên phải */}
        <button className="header-icon-btn relative" title="Thông báo">
          <Bell size={20} />
          {/* Chấm đỏ báo có thông báo mới */}
          <span className="notification-badge" />
        </button>
      </div>
    </header>
  );
}
