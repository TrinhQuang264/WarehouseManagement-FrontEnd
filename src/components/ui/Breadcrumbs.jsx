import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const routeLabels = {
  Dashboard: "Tổng quan",
  products: "Sản phẩm",
  categories: "Danh mục",
  import: "Nhập kho",
  export: "Xuất kho",
  inventory: "Tồn kho",
  suppliers: "Nhà cung cấp",
  customers: "Khách hàng",
  reports: "Báo cáo",
  users: "Người dùng",
  profile: "Thông tin cá nhân",
};

/**
 * Breadcrumbs component
 * @param {Array} items - Custom breadcrumb items: [{ label: string, path?: string }]
 * Example: [{ label: 'Tổng quan' }, { label: 'Sản phẩm', path: '/products' }, { label: 'Thêm mới' }]
 */
export default function Breadcrumbs({ items = null }) {
  const location = useLocation();
  const navigate = useNavigate();

  // If custom items provided, use them
  if (items && Array.isArray(items) && items.length > 0) {
    return (
      <nav className="flex items-center text-sm font-medium text-slate-500 ">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              {!isFirst && (
                <ChevronRight
                  size={14}
                  className="mx-2 text-slate-300 "
                />
              )}

              {isLast ? (
                <span className="text-slate-900  font-semibold">
                  {item.label}
                </span>
              ) : item.path ? (
                <button
                  onClick={() => navigate(item.path)}
                  className="hover:text-primary transition-colors cursor-pointer text-slate-600 "
                >
                  {item.label}
                </button>
              ) : (
                <span className="text-slate-600 hover:text-primary transition-colors cursor-pointer">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  }

  // Default: Auto-generate from URL
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="flex items-center text-sm font-medium text-slate-500 ">
      <Link
        to="/"
        className="flex items-center hover:text-primary transition-colors gap-1.5"
      >
        <span
          className={
            pathnames.length === 0
              ? "text-slate-900  font-semibold"
              : ""
          }
        >
          Tổng quan
        </span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const label = routeLabels[name] || name;

        return (
          <React.Fragment key={name}>
            <ChevronRight
              size={14}
              className="mx-2 text-slate-300 "
            />
            {isLast ? (
              <span className="text-slate-900  font-semibold">
                {label}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-primary transition-colors"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

