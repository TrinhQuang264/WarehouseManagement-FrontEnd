import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Loading from '../../components/ui/Loading';
import categoryService from '../../services/categoryService';

/**
 * Trang quản lý danh mục sản phẩm
 * Hiển thị danh sách các nhóm hàng, cho phép tìm kiếm
 */
export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  /**
   * Debounce search input
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  /**
   * Fetch dữ liệu từ API filter
   */
  const fetchCategories = async (isInitial = false) => {
    setLoading(true);
    if (isInitial) setIsFirstFetch(true);
    
    try {
      console.log(`[CategoriesPage] Requesting: filter="${debouncedSearch}", pageIndex=${currentPage}, pageSize=${pageSize}`);
      const response = await categoryService.filter({
        filter: debouncedSearch,
        pageIndex: currentPage,
        pageSize: pageSize
      });
      
      console.log('[CategoriesPage] API Raw Response:', response);

      let items = [];
      let total = 0;

      if (response) {
        if (Array.isArray(response)) {
          items = response;
          total = response.length;
        } else {
          items = response.items || response.data || response.results || [];
          total = response.totalCount || response.totalItems || response.count || response.total || items.length;
        }
      }
      
      setCategories(Array.isArray(items) ? items : []);
      setTotalCount(total);
    } catch (error) {
      console.error('[CategoriesPage] Lỗi API:', error);
    } finally {
      setLoading(false);
      setIsFirstFetch(false);
    }
  };

  useEffect(() => {
    fetchCategories(isFirstFetch);
  }, [currentPage, pageSize, debouncedSearch]);

  if (isFirstFetch && loading) return <Loading text="Đang tải danh mục..." />;

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2">
            <a href="/" className="hover:text-primary transition-colors">Trang chủ</a>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 dark:text-white font-medium">Danh mục</span>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Danh mục Linh kiện</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý các nhóm sản phẩm và linh kiện trong hệ thống</p>
        </div>
        <Button icon={<Plus size={18} />} className="shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
          Thêm danh mục
        </Button>
      </div>

      {/* ===== SEARCH BAR ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 transition-all hover:shadow-md">
        <div className="flex items-center gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Tìm kiếm tên danh mục..."
            className="w-full md:w-1/2"
          />
        </div>
      </div>

      {/* ===== CATEGORY TABLE ===== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Mã Danh Mục</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Tên Danh Mục</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Mô Tả</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">Số Lượng Sản Phẩm</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-slate-100 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all duration-300">
                    <td className="px-6 py-5 text-sm font-bold text-slate-700 dark:text-slate-300">
                      #{category.id.toString().padStart(4, '0')}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <FolderOpen size={20} />
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500 max-w-xs truncate">
                      {category.seoDescription || '—'}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-900 dark:text-white font-semibold">
                      {/* Số lượng - Ở đây giả lập vì API category không trả về quantity trực tiếp */}
                      {category.quantity || Math.floor(Math.random() * 2000) + 100} 
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-lg shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">
                    Không tìm thấy danh mục nào...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-sm text-slate-500">
            Hiển thị <span className="font-bold text-slate-900 dark:text-white">
              {totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, totalCount)}
            </span> trên <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span> danh mục
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-50"
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
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-primary'
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
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
