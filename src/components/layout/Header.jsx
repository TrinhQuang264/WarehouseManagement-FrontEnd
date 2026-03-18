import { Bell, HelpCircle, Plus } from 'lucide-react';
import SearchBar from '../ui/SearchBar';
import Button from '../ui/Button';

export default function Header({ searchValue = '', onSearchChange }) {
  return (
    <header className="h-16 bg-white dark:bg-bg-dark border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
      {/* ===== Ô tìm kiếm ===== */}
      <SearchBar
        value={searchValue}
        onChange={onSearchChange || (() => {})}
        placeholder="Tìm kiếm linh kiện, mã SKU..."
        className="w-96"
      />

      {/* ===== Các nút hành động bên phải ===== */}
      <div className="flex items-center gap-4">
        {/* Nút thông báo */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 relative">
          <Bell size={20} />
          {/* Chấm đỏ báo có thông báo mới */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent-red rounded-full border-2 border-white" />
        </button>

        {/* Nút trợ giúp */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
          <HelpCircle size={20} />
        </button>
      </div>
    </header>
  );
}
