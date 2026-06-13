import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip as LineTooltip,
} from "recharts";

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-sm font-medium">
        <span className="text-slate-600">{payload[0].name}: </span>
        <span className="font-bold text-slate-900">{payload[0].value}%</span>
      </div>
    );
  }
  return null;
};

const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-sm">
        <p className="font-bold text-slate-800 mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span className="text-slate-600">
            Xuất kho: <span className="font-bold text-slate-900">{payload[0].value}</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardSubCharts({ allocationData, lineChartData }) {
  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Biểu đồ tròn: Tồn kho theo danh mục */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex-1">
        <h3 className="font-bold text-[13px] text-slate-900 mb-2">Tồn kho theo danh mục</h3>
        <div className="flex items-center justify-center gap-2 h-[130px]">
          <div className="w-1/2 h-full relative min-w-0 min-h-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  stroke="none"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <PieTooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-medium text-slate-400">Tổng</span>
              <span className="text-xl font-bold text-slate-800">100%</span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-1/2 flex flex-col gap-1 justify-center">
            {allocationData.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 flex justify-between items-center text-[10px]">
                  <span className="text-slate-600 truncate mr-1" title={item.name}>{item.name}</span>
                  <span className="font-bold text-slate-800">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Biểu đồ đường: Xu hướng xuất kho 30 ngày */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-[13px] text-slate-900">Xu hướng xuất kho 30 ngày</h3>
        </div>
        <div className="w-full h-[130px] min-w-0 min-h-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
            <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94a3b8' }} 
                dy={10} 
                minTickGap={20}
              />
              <LineTooltip content={<CustomLineTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }} />
              <Line 
                type="monotone" 
                dataKey="export" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
