import { useState, useEffect } from 'react';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  Search,
  ChevronDown,
  Filter,
  FileDown,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Smartphone,
  BatteryCharging,
  Camera,
  Cpu,
  Layers
} from 'lucide-react';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import dashboardService from '../../services/dashboardService';

/**
 * Trang kiểm kê tồn kho
 * Cho phép theo dõi số lượng tồn, cảnh báo tồn thấp và xem giá trị kho
 */
export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    totalValue: 0,
    lastUpdate: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  });
  
  const [loading, setLoading] = useState(false);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Lấy dữ liệu thống kê và danh mục khi load trang
  useEffect(() => {
    const initPage = async () => {
      try {
        const [catData, statsData] = await Promise.all([
          categoryService.getAll(),
          dashboardService.getStats()
        ]);
        setCategories(catData || []);
        if (statsData) {
          setStats({
            totalItems: statsData.totalProducts || 0,
            lowStock: statsData.lowStockCount || 0,
            totalValue: statsData.totalInventoryValue || 0,
            lastUpdate: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          });
        }
      } catch (error) {
        console.error('[InventoryPage] Lỗi khởi tạo:', error);
      }
    };
    initPage();
  }, []);

  // Fetch sản phẩm dựa trên filter
  const fetchInventory = async (isInitial = false) => {
    setLoading(true);
    if (isInitial) setIsFirstFetch(true);

    try {
      // Vì API filter có thể chưa hỗ trợ lọc "lowStock" trực tiếp, 
      // ta có thể thực hiện tham khảo cách ProductPage filter
      const response = await productService.filter({
        filter: debouncedSearch,
        pageIndex: currentPage,
        pageSize: pageSize,
        categoryId: selectedCategory || undefined
      });

      const items = response.items || response.data || [];
      const total = response.totalCount || items.length;

      // Giả lập lọc low stock nếu người dùng chọn (vì API có thể chưa có flag này)
      let finalItems = items;
      if (lowStockOnly) {
        finalItems = items.filter(p => p.quantity <= 10);
      }

      setProducts(finalItems);
      setTotalCount(total);
    } catch (error) {
      console.error('[InventoryPage] Lỗi fetch dữ liệu:', error);
    } finally {
      setLoading(false);
      setIsFirstFetch(false);
    }
  };

  useEffect(() => {
    fetchInventory(isFirstFetch);
  }, [currentPage, pageSize, debouncedSearch, selectedCategory, lowStockOnly]);

  if (isFirstFetch && loading) return <Loading text="Đang tải dữ liệu kiểm kê..." />;

  const getCategoryIcon = (catId) => {
    switch(catId) {
      case 4: return <Smartphone size={18} className="text-slate-400" />;
      case 5: return <BatteryCharging size={18} className="text-slate-400" />;
      case 6: return <Camera size={18} className="text-slate-400" />;
      case 7: return <Layers size={18} className="text-slate-400" />;
      default: return <Cpu size={18} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2">
            <a href="/" className="hover:text-primary transition-colors">Trang chủ</a>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 dark:text-white font-medium">Tồn kho</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Kiểm kê Tồn kho</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý và theo dõi số lượng linh kiện điện thoại thực tế.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={<FileDown size={18} />}>
            Xuất báo cáo
          </Button>
          <Button icon={<Plus size={18} />}>
            Nhập hàng mới
          </Button>
        </div>
      </div>

      {/* ===== STATS OVERVIEW ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tổng mặt hàng</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{stats.totalItems.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-red-500 shadow-sm transition-all hover:shadow-md">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Sắp hết hàng</p>
          <p className="text-2xl font-extrabold text-red-600 dark:text-red-400 mt-2">{stats.lowStock}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tổng giá trị kho</p>
          <p className="text-2xl font-extrabold text-primary mt-2">{(stats.totalValue / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Cập nhật lần cuối</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{stats.lastUpdate}</p>
        </div>
      </div>

      {/* ===== FILTERS & SEARCH ===== */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-4 transition-all hover:shadow-md">
        <div className="relative flex-grow max-w-md">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Tìm tên sản phẩm, mã SKU..."
          />
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm rounded-xl py-2 pl-3 pr-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Theo nhóm: Tất cả</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => setLowStockOnly(false)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${!lowStockOnly ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setLowStockOnly(true)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${lowStockOnly ? 'bg-white dark:bg-slate-700 text-accent-red shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Theo tồn thấp
            </button>
          </div>
        </div>

        <div className="ml-auto">
          <button className="p-2 text-slate-400 hover:text-primary transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* ===== DATA TABLE ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nhóm</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Số lượng tồn</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Đơn giá (VNĐ)</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Cảnh báo</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-slate-100 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                          {getCategoryIcon(product.categoryId)}
                        </div>
                        <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{product.name}</p>
                        <p className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-wider">SKU: {product.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="blue" className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] uppercase">
                        {categories.find(c => c.id === product.categoryId)?.name || 'Linh kiện'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-black ${product.quantity <= 10 ? 'text-accent-red' : 'text-slate-900 dark:text-white'}`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-600">
                      {new Intl.NumberFormat('vi-VN').format(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {product.quantity <= 10 ? (
                          <Badge variant="red" className="flex items-center gap-1 animate-pulse py-1 px-3 border-red-200">
                            <span className="w-1.5 h-1.5 bg-accent-red rounded-full" />
                            Tồn thấp
                          </Badge>
                        ) : (
                          <Badge variant="success" className="py-1 px-3 border-emerald-200">
                            An toàn
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-primary p-2 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic">
                    Không tìm thấy dữ liệu tồn kho...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== PAGINATION ===== */}
        <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-500">
            Hiển thị <span className="font-bold text-slate-900 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * pageSize, totalCount)}</span> trong số <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span> sản phẩm
          </p>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-primary transition-all disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === page
                      ? 'bg-primary text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage * pageSize >= totalCount}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-primary transition-all disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
