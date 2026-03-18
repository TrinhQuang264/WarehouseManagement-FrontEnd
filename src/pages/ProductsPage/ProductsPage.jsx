import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Filter,
  FileDown,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

/**
 * Trang quản lý sản phẩm
 * Hiển thị danh sách sản phẩm, hỗ trợ tìm kiếm và lọc theo khoảng giá
 */
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  /**
   * Lấy danh mục linh kiện để hiển thị tên thay vì ID
   */
  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('[ProductsPage] Lỗi lấy danh mục:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Debounce search input và reset về trang 1
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      // Chỉ reset về trang 1 khi từ khóa tìm kiếm thay đổi thực sự
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Luôn về trang 1 khi debouncedSearch thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  /**
   * Fetch dữ liệu từ API filter
   */
  const fetchProducts = async (isInitial = false) => {
    setLoading(true);
    if (isInitial) setIsFirstFetch(true);
    
    try {
      console.log(`[ProductsPage] Requesting API: filter="${debouncedSearch}", page=${currentPage}, size=${pageSize}`);
      const response = await productService.filter({
        filter: debouncedSearch,
        pageIndex: currentPage,
        pageSize: pageSize
      });
      
      console.log('[ProductsPage] API Raw Response:', response);
      
      let items = [];
      let total = 0;

      if (response) {
        if (Array.isArray(response)) {
          items = response;
          total = response.length;
        } else {
          // Kiểm tra mọi khả năng tên trường trả về từ backend
          items = response.items || response.data || response.results || response.products || [];
          total = response.totalCount || response.totalItems || response.count || response.total || items.length;
        }
      }
      
      setProducts(Array.isArray(items) ? items : []);
      setTotalCount(total);
    } catch (error) {
      console.error('[ProductsPage] Lỗi API:', error);
    } finally {
      setLoading(false);
      setIsFirstFetch(false);
    }
  };

  useEffect(() => {
    fetchProducts(isFirstFetch);
  }, [currentPage, pageSize, debouncedSearch]);

  /**
   * Xử lý lọc client-side cho khoảng giá (vì API filter cơ bản có thể không hỗ trợ min/max price)
   */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const price = p.importPrice || p.price || 0;
      const minMatch = minPrice === '' || price >= Number(minPrice);
      const maxMatch = maxPrice === '' || price <= Number(maxPrice);
      return minMatch && maxMatch;
    });
  }, [products, minPrice, maxPrice]);

  if (isFirstFetch && loading) return <Loading text="Đang tải danh sách sản phẩm..." />;

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2">
            <a href="/" className="hover:text-primary transition-colors">Trang chủ</a>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 dark:text-white font-medium">Sản phẩm</span>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Danh mục Sản phẩm</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý thông tin và tồn kho chi tiết linh kiện điện thoại</p>
        </div>
        <Button icon={<Plus size={18} />} className="shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
          Thêm sản phẩm
        </Button>
      </div>

      {/* ===== SEARCH & FILTER BAR ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 transition-all hover:shadow-md">
        <div className="flex flex-col lg:flex-row items-center gap-5">
          {/* Tìm kiếm */}
          <div className="w-full lg:w-1/3">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Tìm kiếm mã, tên sản phẩm..."
              className="w-full"
            />
          </div>

          {/* Lọc theo giá tiền */}
          <div className="flex items-center gap-3 w-full lg:w-auto bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">Min</span>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="pl-12 pr-4 py-2 w-28 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
              />
            </div>
            <div className="w-2 h-[1px] bg-slate-300 dark:bg-slate-600"></div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">Max</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="pl-12 pr-4 py-2 w-32 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Nút lọc mở rộng & Xuất file */}
          <div className="flex items-center gap-3 w-full lg:w-auto lg:ml-auto">
            <Button variant="secondary" icon={<Filter size={18} className="text-slate-500" />}>
              Bộ lọc nâng cao
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => {
                setSearch('');
                setMinPrice('');
                setMaxPrice('');
                setCurrentPage(1);
              }}
              title="Làm mới bộ lọc"
            >
              Đặt lại
            </Button>
            <Button variant="secondary" icon={<FileDown size={18} className="text-slate-500" />}>
              Xuất Excel
            </Button>
          </div>
        </div>
      </div>

      {/* ===== PRODUCT TABLE ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">Mã Sản Phẩm</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Tên Linh Kiện</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Nhóm Hàng</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Giá Bán (VNĐ)</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Tồn Kho</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-slate-100 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-primary/5 transition-all duration-300">
                    <td className="px-6 py-4 text-sm font-bold text-primary cursor-pointer hover:underline decoration-2 underline-offset-4">
                      {product.code}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 group-hover:border-primary/20 group-hover:scale-110 transition-all duration-300">
                           <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image' }}
                           />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="blue" className="bg-primary/10 text-primary border-none font-bold text-[10px] uppercase tracking-wide">
                        {categories.find(c => c.id === product.categoryId)?.name || (product.categoryId === 4 ? 'MÀN HÌNH' : 'LINH KIỆN')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.importPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ring-4 ${product.quantity > 10 ? 'bg-emerald-500 ring-emerald-500/10' : product.quantity > 0 ? 'bg-amber-500 ring-amber-500/10' : 'bg-red-500 ring-red-500/10'}`} />
                        <span className="text-sm font-bold text-slate-700">{product.quantity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100 transition-all" title="Sửa">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100 transition-all" title="Xóa">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic">
                    Không tìm thấy sản phẩm nào phù hợp...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== PAGINATION ===== */}
        <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-sm text-slate-500">
            Hiển thị <span className="font-bold text-slate-900 dark:text-white">
              {totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span> - <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * pageSize, totalCount)}</span> trong <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span> sản phẩm
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary hover:border-primary/30 dark:hover:border-primary/50 transition-all disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: Math.min(5, Math.ceil(totalCount / pageSize)) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`w-9 h-9 rounded-xl font-bold text-sm transition-all ${
                    currentPage === page
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalCount / pageSize), p + 1))}
              disabled={currentPage >= Math.ceil(totalCount / pageSize)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary hover:border-primary/30 transition-all disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
