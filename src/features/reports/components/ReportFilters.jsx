import { Calendar, Filter } from "lucide-react";

export default function ReportFilters({
  categories,
  selectedDateRange,
  setSelectedDateRange,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  selectedCategory,
  setSelectedCategory,
  subtitleDateText,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {/* Time Filter */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Calendar size={13} className="text-slate-400" />
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Thời gian:
          </span>
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="border-none bg-transparent text-xs font-semibold focus:ring-0 p-0 pr-6 cursor-pointer outline-none text-slate-700"
          >
            <option value="month">Tháng này</option>
            <option value="lastMonth">Tháng trước</option>
            <option value="quarter">Quý này</option>
            <option value="custom">Tùy chọn...</option>
          </select>
        </div>

        {/* Custom Date Inputs */}
        {selectedDateRange === "custom" && (
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="border-none text-xs text-slate-700 bg-transparent p-0 outline-none focus:ring-0"
            />
            <span className="text-slate-400 text-xs">-</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="border-none text-xs text-slate-700 bg-transparent p-0 outline-none focus:ring-0"
            />
          </div>
        )}

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Danh mục:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-slate-200 rounded-lg text-xs font-semibold py-1.5 px-3 bg-white focus:ring-2 focus:ring-primary/10 cursor-pointer outline-none text-slate-700"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subtitle date range */}
      <p className="text-[11px] text-slate-400 italic hidden md:block">
        {subtitleDateText}
      </p>
    </div>
  );
}
