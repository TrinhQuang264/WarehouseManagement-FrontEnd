import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-sm">
        <p className="font-bold text-slate-800 mb-2">{label}</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-slate-600">
              Nhập kho:{" "}
              <span className="font-bold text-slate-900">
                {payload[0].value}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">
              Xuất kho:{" "}
              <span className="font-bold text-slate-900">
                {payload[1].value}
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardMainChart({
  data,
  selectedYear,
  setSelectedYear,
  availableYears = [],
}) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 h-full flex flex-col min-h-[350px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm text-slate-900">
          Thống kê nhập xuất theo tháng
        </h3>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="w-24 text-[11px] border border-slate-200 rounded-lg  py-1 focus:outline-none focus:border-blue-500 text-slate-600 bg-slate-50 cursor-pointer"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              Năm {year}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={4}
            barSize={16}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
              dy={10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#475569",
              }}
            />
            <Bar
              dataKey="import"
              name="Nhập kho"
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="export"
              name="Xuất kho"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
