import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import SearchBar from '../../../components/ui/SearchBar';
import Loading from '../../../components/ui/Loading';
import { useCategories } from '../hooks/useCategories.jsx';
import '../styles/Categories.css';

export default function CategoriesPage() {
  const {
    categories,
    loading,
    isFirstFetch,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    pageSize,
    totalCount
  } = useCategories();

  if (isFirstFetch && loading) return <Loading text="Đang tải danh mục..." />;

  return (
    <div className="categories-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2">
            <a href="/" className="hover:text-primary transition-colors">Trang chủ</a>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 dark:text-white font-medium">Danh mục</span>
          </nav>
          <h1 className="page-title">Danh mục Linh kiện</h1>
          <p className="page-subtitle">Quản lý các nhóm sản phẩm và linh kiện trong hệ thống</p>
        </div>
        <Button icon={<Plus size={18} />} className="shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
          Thêm danh mục
        </Button>
      </div>

      {/* SEARCH BAR */}
      <div className="search-filter-bar">
        <div className="flex items-center gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Tìm kiếm tên danh mục..."
            className="w-full md:w-1/2"
          />
        </div>
      </div>

      {/* CATEGORY TABLE */}
      <div className="category-table-wrapper">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <th className="table-th px-6">Mã Danh Mục</th>
                <th className="table-th px-6">Tên Danh Mục</th>
                <th className="table-th px-6">Mô Tả</th>
                <th className="table-th px-6">Số Lượng Sản Phẩm</th>
                <th className="table-th px-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-slate-100 dark:divide-slate-800/50 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="group table-row-hover">
                    <td className="px-6 py-5 text-sm font-bold text-slate-700 dark:text-slate-300">
                      #{category.id.toString().padStart(4, '0')}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="category-icon-box">
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
                      <div className="action-buttons-group justify-end">
                        <button className="action-btn text-slate-400 hover:text-primary" title="Sửa">
                          <Edit size={18} />
                        </button>
                        <button className="action-btn text-slate-400 hover:text-red-500" title="Xóa">
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
        <div className="pagination-container">
          <span className="pagination-info">
            Hiển thị <span className="font-bold text-slate-900 dark:text-white">
              {totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, totalCount)}
            </span> trên <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span> danh mục
          </span>
          <div className="pagination-controls">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="pagination-page-list">
              {Array.from({ length: Math.min(5, Math.ceil(totalCount / pageSize)) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-page-btn ${currentPage === page ? 'pagination-page-btn-active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalCount / pageSize), p + 1))}
              disabled={currentPage >= Math.ceil(totalCount / pageSize) || totalCount === 0}
              className="pagination-btn"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
