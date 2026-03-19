import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels = {
  '': 'Dashboard',
  'products': 'Sản phẩm',
  'categories': 'Danh mục',
  'import': 'Nhập kho',
  'export': 'Xuất kho',
  'inventory': 'Tồn kho',
  'suppliers': 'Nhà cung cấp',
  'customers': 'Khách hàng',
  'reports': 'Báo cáo',
  'users': 'Người dùng',
  'settings': 'Cài đặt',
  'profile': 'Thông tin cá nhân'
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
      <Link 
        to="/" 
        className="flex items-center hover:text-primary transition-colors gap-1.5"
      >
        <Home size={16} />
        <span className={pathnames.length === 0 ? "text-slate-900 dark:text-white font-semibold" : ""}>
          Dashboard
        </span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = routeLabels[name] || name;

        return (
          <React.Fragment key={name}>
            <ChevronRight size={14} className="mx-2 text-slate-300 dark:text-slate-600" />
            {isLast ? (
              <span className="text-slate-900 dark:text-white font-semibold">
                {label}
              </span>
            ) : (
              <Link to={routeTo} className="hover:text-primary transition-colors">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
