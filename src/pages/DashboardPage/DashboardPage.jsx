/**
 * DashboardPage.jsx — Trang tổng quan (Dashboard)
 *
 * Hiển thị:
 * 1. 4 thẻ thống kê (Tổng tồn kho, Sản phẩm sắp hết, Nhập hôm nay, Xuất hôm nay)
 * 2. Biểu đồ cột: Xu hướng Nhập/Xuất 7 ngày
 * 3. Biểu đồ vòng: Phân bổ tồn kho
 * 4. Bảng: Top sản phẩm bán chạy
 *
 * DATA:
 * - Gọi API lấy dữ liệu thật từ backend ASP.NET Core
 * - Nếu API lỗi → sử dụng MOCK DATA (dữ liệu mẫu) để demo
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, LogIn, LogOut } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import dashboardService from '../../services/dashboardService';
import { formatNumber, formatCurrency } from '../../helpers/formatNumber';

// ============================================
// MOCK DATA — Dùng khi chưa có backend
// ============================================
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
  { name: 'Màn hình', percent: 45, color: 'bg-primary', stroke: 'stroke-primary' },
  { name: 'Pin điện thoại', percent: 25, color: 'bg-accent-orange', stroke: 'stroke-accent-orange' },
  { name: 'Vỏ & Linh kiện khác', percent: 30, color: 'bg-accent-green', stroke: 'stroke-accent-green' },
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
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
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-slate-900">Xu hướng Nhập/Xuất</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <span className="w-3 h-3 bg-primary rounded-full" /> Nhập
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 ml-4">
                <span className="w-3 h-3 bg-primary/20 rounded-full" /> Xuất
              </div>
              <select className="ml-4 text-xs bg-slate-50 border-none rounded-lg focus:ring-0 outline-none">
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
              </select>
            </div>
          </div>

          {/* Bar chart — pure CSS */}
          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {MOCK_CHART_DATA.map((d) => (
              <div key={d.day} className="flex-1 space-y-2">
                <div className="flex gap-1 items-end h-48">
                  {/* Cột Xuất (nhạt hơn) */}
                  <div
                    className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-all"
                    style={{ height: `${d.export}%` }}
                  />
                  {/* Cột Nhập (đậm) */}
                  <div
                    className="w-full bg-primary rounded-t transition-all"
                    style={{ height: `${d.import}%` }}
                  />
                </div>
                <div className="text-[10px] text-center text-slate-400 uppercase font-bold">
                  {d.day}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Biểu đồ vòng — Phân bổ tồn kho */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-lg mb-6 text-slate-900">Phân bổ Tồn kho</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* SVG Ring Chart */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  className="stroke-slate-100"
                  cx="18" cy="18" r="16"
                  fill="none" strokeWidth="3"
                />
                {/* Màn hình: 45% */}
                <circle
                  className="stroke-primary"
                  cx="18" cy="18" r="16"
                  fill="none" strokeWidth="3"
                  strokeDasharray="45, 100"
                />
                {/* Pin: 25% */}
                <circle
                  className="stroke-accent-orange"
                  cx="18" cy="18" r="16"
                  fill="none" strokeWidth="3"
                  strokeDasharray="25, 100"
                  strokeDashoffset="-45"
                />
                {/* Vỏ: 30% */}
                <circle
                  className="stroke-accent-green"
                  cx="18" cy="18" r="16"
                  fill="none" strokeWidth="3"
                  strokeDasharray="30, 100"
                  strokeDashoffset="-70"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400">Tổng</span>
                <span className="text-xl font-bold text-slate-900">100%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 grid grid-cols-1 w-full gap-3">
              {MOCK_ALLOCATION.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 ${item.color} rounded-full`} />
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. TOP PRODUCTS TABLE ===== */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900">Top sản phẩm bán chạy</h3>
          <button className="text-primary text-sm font-medium hover:underline">
            Xem tất cả
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
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
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">Loại: {product.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">{product.sku}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{formatNumber(product.sold)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatNumber(product.stock)}</td>
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
    </motion.div>
  );
}
