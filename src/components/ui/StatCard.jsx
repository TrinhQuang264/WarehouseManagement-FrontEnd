export default function StatCard({
  title,
  value,
  icon,
  iconBgClass = "bg-primary/10",
  trend,
  subtitle,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 ">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${iconBgClass}`}>{icon}</div>
        {trend && <div>{trend}</div>}
      </div>

      <p className="text-slate-500 text-sm font-medium">{title}</p>

      <h3 className="text-2xl font-bold mt-1 text-slate-900 ">{value}</h3>

      {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
    </div>
  );
}
