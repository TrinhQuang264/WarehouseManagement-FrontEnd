/**
 * SearchBar.jsx — Component thanh tìm kiếm
 *
 * Props:
 *  - value: string (giá trị hiện tại)
 *  - onChange: function (callback khi nhập)
 *  - placeholder: string (gợi ý trong ô input)
 *  - className: string (class bổ sung)
 */
import { Search } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Icon kính lúp bên trái */}
      <Search
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      {/* Ô input tìm kiếm */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-transparent
                   focus:border-primary focus:ring-0 rounded-lg text-sm transition-all outline-none"
      />
    </div>
  );
}
