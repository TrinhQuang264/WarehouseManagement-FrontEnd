/**
 * Input.jsx — Component ô nhập liệu tái sử dụng
 *
 * Props:
 *  - label: string (nhãn hiển thị phía trên)
 *  - icon: ReactNode (icon bên trái)
 *  - error: string (thông báo lỗi)
 *  - rightElement: ReactNode (phần tử bên phải, VD: nút show/hide password)
 *  - ...rest: các props HTML input khác (type, value, onChange, placeholder, v.v.)
 */
export default function Input({
  label,
  icon,
  error,
  rightElement,
  className = '',
  ...rest
}) {
  return (
    <div className="w-full">
      {/* Nhãn (label) */}
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Wrapper cho input + icon */}
      <div className="relative">
        {/* Icon bên trái */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}

        {/* Ô input chính */}
        <input
          className={`
            block w-full rounded-xl border border-slate-300
            focus:ring-2 focus:ring-primary focus:border-primary
            transition-all outline-none text-sm
            ${icon ? 'pl-10' : 'pl-3'}
            ${rightElement ? 'pr-10' : 'pr-3'}
            py-2.5
            ${error ? 'border-accent-red focus:ring-accent-red' : ''}
            ${className}
          `}
          {...rest}
        />

        {/* Phần tử bên phải (VD: nút toggle password) */}
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <p className="mt-1 text-xs text-accent-red">{error}</p>
      )}
    </div>
  );
}
