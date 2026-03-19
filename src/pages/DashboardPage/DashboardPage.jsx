import { Package, AlertTriangle, LogIn, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import { formatNumber, formatCurrency } from '../../helpers/formatNumber';
import { useDashboard } from '../../hooks/useDashboard.jsx';
import '../../styles/Dashboard.css';

// Custom Tooltip components for Recharts
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 text-sm">
        <p className="font-bold text-slate-800 dark:text-slate-100 mb-2">{label}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-slate-600 dark:text-slate-300">Nhập: <span className="font-semibold text-slate-900 dark:text-white">{payload[1].value}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-600" />
            <span className="text-slate-600 dark:text-slate-300">Xuất: <span className="font-semibold text-slate-900 dark:text-white">{payload[0].value}</span></span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 text-sm font-medium">
        <span className="text-slate-600 dark:text-slate-300">{payload[0].name}: </span>
        <span className="text-slate-900 dark:text-white">{payload[0].value}%</span>
      </div>
    );
  }
  return null;
};

// Custom Tooltip components for Recharts
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 text-sm">
        <p className="font-bold text-slate-800 dark:text-slate-100 mb-2">{label}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-slate-600 dark:text-slate-300">Nhập: <span className="font-semibold text-slate-900 dark:text-white">{payload[1].value}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-600" />
            <span className="text-slate-600 dark:text-slate-300">Xuất: <span className="font-semibold text-slate-900 dark:text-white">{payload[0].value}</span></span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 text-sm font-medium">
        <span className="text-slate-600 dark:text-slate-300">{payload[0].name}: </span>
        <span className="text-slate-900 dark:text-white">{payload[0].value}%</span>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const {
    stats,
    loading,
    chartData,
    allocation,
    topProducts
  } = useDashboard();

  if (loading) return <Loading text="Đang tải dữ liệu dashboard..." />;

  return (
    <div className="dashboard-page">
      // 1. SUMMARY CARDS
      <section className="dashboard-grid">
        <StatCard
          title="Tổng tồn kho"
          value={formatNumber(stats.totalInventory)}
          icon={<Package size={24} className="text-primary" />}
          iconBgClass="bg-primary/10"
          trend={<Badge variant="green">+12%</Badge>}
          subtitle="Linh kiện đang có sẵn"
        />
        <StatCard
          title="Sản phẩm sắp hết"
          value={stats.lowStockCount}
          icon={<AlertTriangle size={24} className="text-accent-red" />}
          iconBgClass="bg-red-50"
          trend={<Badge variant="red">Cần nhập</Badge>}
          subtitle="Dưới ngưỡng an toàn"
        />
        <StatCard
          title="Nhập hôm nay"
          value={formatNumber(stats.todayImport)}
          icon={<LogIn size={24} className="text-accent-green" />}
          iconBgClass="bg-emerald-50"
          trend={<span className="text-slate-400 text-xs font-medium">Hôm nay</span>}
          subtitle="Tăng 5% so với hôm qua"
        />
        <StatCard
          title="Xuất hôm nay"
          value={formatNumber(stats.todayExport)}
          icon={<LogOut size={24} className="text-accent-orange" />}
          iconBgClass="bg-amber-50"
          trend={<span className="text-slate-400 text-xs font-medium">Hôm nay</span>}
          subtitle="32 đơn hàng đã hoàn tất"
        />
      </section>

      // 2. CHARTS
      <section className="dashboard-charts-grid">
        // Biểu đồ cột — Xu hướng Nhập/Xuất
        <div className="lg:col-span-2 chart-container">
          <div className="chart-header">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Xu hướng Nhập/Xuất</h3>
            <div className="chart-legend">
              <div className="chart-legend-item">
                <span className="w-3 h-3 bg-primary rounded-full" /> Nhập
              </div>
              <div className="chart-legend-item ml-4">
                <span className="w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded-full" /> Xuất
              </div>
              <select className="ml-4 text-xs bg-slate-50 dark:bg-slate-800/50 border-none rounded-lg focus:ring-0 outline-none p-1 px-2 cursor-pointer dark:text-white">
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
              </select>
            </div>
          </div>

          <div className="flex-1 min-h-[250px] w-full mt-2">
            <ResponsiveContainer width="100%" height="auto" aspect={2.5}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={2} barSize={20}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
                  dy={10} 
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="export" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="import" fill="#137fec" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        // Biểu đồ vòng — Phân bổ tồn kho
        <div className="chart-container">
          <h3 className="font-bold text-lg mb-6 text-slate-900 dark:text-white">Phân bổ Tồn kho</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            
            <div className="pie-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    stroke="none"
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              // Inner Text Center
              <div className="pie-chart-center">
                <span className="text-xs text-slate-400">Tổng</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">100%</span>
              </div>
            </div>

            // Legend
            <div className="pie-legend">
              {allocation.map((item) => (
                <div key={item.name} className="pie-legend-item">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      // 3. TOP PRODUCTS TABLE
      <section className="top-products-section">
        <div className="top-products-header">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Top sản phẩm bán chạy</h3>
          <button className="text-primary text-sm font-medium hover:underline transition-colors">
            Xem tất cả
          </button>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80">
                <th className="table-th px-6">Sản phẩm</th>
                <th className="table-th px-6">Mã SKU</th>
                <th className="table-th px-6">Đã bán</th>
                <th className="table-th px-6">Tồn kho</th>
                <th className="table-th px-6">Doanh thu</th>
                <th className="table-th px-6">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {topProducts.map((product) => (
                <tr key={product.id} className="table-row-hover">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="product-thumb">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">{product.name}</p>
                        <p className="text-xs text-slate-500">Loại: {product.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-400">{product.sku}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{formatNumber(product.sold)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{formatNumber(product.stock)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-primary">{formatCurrency(product.revenue)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={product.status === 'selling' ? 'green' : 'orange'}>
                      {product.status === 'selling' ? 'Đang bán tốt' : 'Sắp hết'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
