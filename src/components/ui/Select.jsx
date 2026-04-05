import React from 'react';

/**
 * Select - Thành phần Dropdown dùng chung
 */
export default function Select({
  label,
  icon,
  error,
  className = '',
  children,
  ...rest
}) {
  return (
    <div className="w-full text-left">
      {/* Nhãn (label) */}
      {label && (
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
          {label}
        </label>
      )}

      {/* Wrapper cho select + icon */}
      <div className="relative">
        {/* Icon bên trái */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {React.cloneElement(icon, { size: 18 })}
          </div>
        )}

        {/* Ô select chính */}
        <select
          className={`
            block w-full rounded-2xl border border-slate-200 dark:border-slate-700
            bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white
            focus:ring-2 focus:ring-primary/20 focus:border-primary
            transition-all outline-none text-sm appearance-none
            ${icon ? 'pl-10' : 'pl-4'}
            pr-10
            py-3
            cursor-pointer
            ${error ? 'border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...rest}
        >
          {children}
        </select>

        {/* Custom Arrow */}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
