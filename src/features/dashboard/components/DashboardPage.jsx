import { useState, useEffect } from 'react';
import { Package, AlertTriangle, LogIn, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import dashboardService from '../../features/dashboard/api/dashboardService';
import { formatNumber, formatCurrency } from '../../features/dashboard/helpers/formatNumber';

// MOCK DATA — Dùng khi chưa có backend
const MOCK_STATS = {
  totalInventory: 24510,
  lowStockCount: 18,
  todayImport: 1240,
  todayExport: 958,
};

const MOCK_CHART_DATA = [
  { day: 'Thứ 2', import: 85, export: 60 },
  { day: 'Thứ 3', import: 70, export: 40 },
  { day: 'Thứ 4', import: 45, export: 55 },
  { day: 'Thứ 5', import: 95, export: 75 },
  { day: 'Thứ 6', import: 50, export: 30 },
  { day: 'Thứ 7', import: 35, export: 20 },
  { day: 'CN', import: 25, export: 15 },
];

const MOCK_ALLOCATION = [
  { name: 'Màn hình', value: 45, color: '#137fec' }, // bg-primary
  { name: 'Pin điện thoại', value: 25, color: '#f59e0b' }, // bg-accent-orange
  { name: 'Vỏ & Linh kiện khác', value: 30, color: '#10b981' }, // bg-accent-green
];

const MOCK_TOP_PRODUCTS = [
  {
    id: 1,
    name: 'Màn hình iPhone 13 Pro Max',
    type: 'OLED Zin',
    sku: 'SCR-I13PM-001',
    sold: 452,
    stock: 1240,
    revenue: 1250000000,
    status: 'selling',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-19TXUkPkRvBcNrvpN1fPSgnvDrg-MqaYnnClRW_vFiHS2azMg76QMhV-MpZp24pIsAH1S_g8kpwN5eGjTUX7bFLBOMUKMmjjJeDFpNvuxwefnLcs8lzg3PzttmK1HQlLwZFkCxMa0wkOfzsSC-vWV61X7KKJvZ9-3kmW7tjuRw5GduPl1qPU3M_EXAZTESo3lw0rsCH4mMdm5uNMVmnAcpa0fLnAuaUmxlY6ZoJGeGet5pbC7ydHHH4XRvWAFjstF_7PxWHFD8A',
  },
  {
    id: 2,
    name: 'Pin Samsung Galaxy S21 Ultra',
    type: 'Chính hãng',
    sku: 'BAT-SS21U-024',
    sold: 321,
    stock: 85,
    revenue: 245000000,
    status: 'low',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFaSW0OUOozyVpchJ5OgoYxAGAwl13QvIQIs3AmX3XO7SUT58szoPU4lCp4Jhel0bSvh54pMGL6e-2XR9kuCN_CMJ_FvBN4drIGq4NsSpGa2XcnlQzZ8dAGE-TfXRfBpwKj8Y2ZXTUgHStQ6PxepV9xM1HG7AH1FN4YajxrnGP-Xx9gyYBlPfUD2pZaicZO31-rjbJ_Fol0YAjF7JalYkCm-xJeq0DkpcJmJ3dBlEeIYT4MgqqCxlf2TQcwBuQUTvUq3kltX5l1-Y',
  },
  {
    id: 3,
    name: 'Vỏ mặt sau iPhone 14',
    type: 'Kính zin',
    sku: 'BKC-I14-99',
    sold: 215,
    stock: 512,
    revenue: 158000000,
    status: 'selling',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7mROHl8WLDtgoDb18UjBAO6n1kYMfBe1AnQihVm8sV7g-kjB_hlDt10kCBqae1kYEhXGTT_t4ztGd83eEWqFLRyTKYQKP-xuiYlA3y5chzfM_a1Qprpxw2Bv8TCqa32yECLPABreh4aARvhHf5NheSWdJcmyhiPwYz3OrCAD0OGPn08WD-ZL7ZHDxUVHIkrJMLVhsP-Hhsnld629uSBbhw5suJJGy6reXfrgJzRci_VrClS8YZrPeTcC6lmRW0loDIW5EQn9Q5_g',
  },
];

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
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Gọi API lấy dữ liệu dashboard
   * Nếu backend chưa sẵn sàng → dùng mock data
   */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch {
        // API chưa có → dùng mock data
        console.info('📦 Sử dụng mock data cho Dashboard (API chưa kết nối)');
        setStats(MOCK_STATS);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loading text="Đang tải dữ liệu dashboard..." />;

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* ===== 1. SUMMARY CARDS ===== */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* ===== 2. CHARTS ===== */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ cột — Xu hướng Nhập/Xuất */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Xu hướng Nhập/Xuất</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <span className="w-3 h-3 bg-primary rounded-full" /> Nhập
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 ml-4">
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
              <BarChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={2} barSize={20}>
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

        {/* Biểu đồ vòng — Phân bổ tồn kho */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
          <h3 className="font-bold text-lg mb-6 text-slate-900 dark:text-white">Phân bổ Tồn kho</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_ALLOCATION}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    stroke="none"
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {MOCK_ALLOCATION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Text Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-400">Tổng</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">100%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 grid grid-cols-1 w-full gap-3">
              {MOCK_ALLOCATION.map((item) => (
                <div key={item.name} className="flex items-center justify-between group cursor-default">
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

      {/* ===== 3. TOP PRODUCTS TABLE ===== */}
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Top sản phẩm bán chạy</h3>
          <button className="text-primary text-sm font-medium hover:underline transition-colors">
            Xem tất cả
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã SKU</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Đã bán</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tồn kho</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Doanh thu</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_TOP_PRODUCTS.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
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
