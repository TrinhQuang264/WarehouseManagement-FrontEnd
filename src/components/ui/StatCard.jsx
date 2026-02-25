/**
 * StatCard.jsx — Component thẻ thống kê trên Dashboard
 *
 * Props:
 *  - title: string (tên chỉ số, VD: "Tổng tồn kho")
 *  - value: string | number (giá trị hiển thị)
 *  - icon: ReactNode (icon minh họa)
 *  - iconBgClass: string (class cho nền icon, VD: "bg-primary/10")
 *  - trend: ReactNode | string (phần xu hướng bên phải, VD: badge "+12%")
 *  - subtitle: string (mô tả phụ bên dưới)
 */
export default function StatCard({
  title,
  value,
  icon,
  iconBgClass = 'bg-primary/10',
  trend,
  subtitle,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      {/* Hàng trên: icon + trend */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${iconBgClass}`}>
          {icon}
        </div>
        {trend && <div>{trend}</div>}
      </div>

      {/* Tên chỉ số */}
      <p className="text-slate-500 text-sm font-medium">{title}</p>

      {/* Giá trị lớn */}
      <h3 className="text-2xl font-bold mt-1 text-slate-900">{value}</h3>

      {/* Mô tả phụ */}
      {subtitle && (
        <p className="text-xs text-slate-400 mt-2">{subtitle}</p>
      )}
    </div>
  );
}
