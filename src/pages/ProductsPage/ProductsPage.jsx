import {
  Plus,
  Filter,
  FileDown,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import { useProducts } from '../../hooks/useProducts.jsx';
import '../../styles/Products.css';

export default function ProductsPage() {
  const {
    products,
    categories,
    loading,
    isFirstFetch,
    search,
    setSearch,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    currentPage,
    setCurrentPage,
    pageSize,
    totalCount,
    resetFilters
  } = useProducts();

  if (isFirstFetch && loading) return <Loading text="Đang tải danh sách sản phẩm..." />;

  return (
    <div className="products-page">
      // HEADER
      <div className="page-header">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2">
            <a href="/" className="hover:text-primary transition-colors">Trang chủ</a>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 dark:text-white font-medium">Sản phẩm</span>
          </nav>
          <h1 className="page-title">Danh mục Sản phẩm</h1>
          <p className="page-subtitle">Quản lý thông tin và tồn kho chi tiết linh kiện điện thoại</p>
        </div>
        <Button icon={<Plus size={18} />} className="shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
          Thêm sản phẩm
        </Button>
      </div>

      // SEARCH & FILTER BAR
      <div className="search-filter-bar">
        <div className="flex flex-col lg:flex-row items-center gap-5">
          // Tìm kiếm
          <div className="w-full lg:w-1/3">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Tìm kiếm mã, tên sản phẩm..."
              className="w-full"
            />
          </div>

          // Lọc theo giá tiền
          <div className="price-filter-group">
            <div className="price-input-wrapper">
              <span className="price-input-label">Min</span>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="price-input"
              />
            </div>
            <div className="w-2 h-[1px] bg-slate-300 dark:bg-slate-600"></div>
            <div className="price-input-wrapper">
              <span className="price-input-label">Max</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="price-input !w-32"
              />
            </div>
          </div>

          // Nút lọc mở rộng & Xuất file
          <div className="flex items-center gap-3 w-full lg:w-auto lg:ml-auto">
            <Button variant="secondary" icon={<Filter size={18} className="text-slate-500" />}>
              Bộ lọc nâng cao
            </Button>
            <Button 
              variant="secondary" 
              onClick={resetFilters}
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

      // PRODUCT TABLE
      <div className="product-table-wrapper">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <th className="table-th px-6">Mã Sản Phẩm</th>
                <th className="table-th px-6">Tên Linh Kiện</th>
                <th className="table-th px-6">Nhóm Hàng</th>
                <th className="table-th px-6">Giá Bán (VNĐ)</th>
                <th className="table-th px-6">Tồn Kho</th>
                <th className="table-th px-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-slate-100 dark:divide-slate-800/50 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="group table-row-hover">
                    <td className="px-6 py-4 text-sm font-bold text-primary cursor-pointer hover:underline decoration-2 underline-offset-4">
                      {product.code}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="product-img-box">
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
                        <span className={`stock-indicator ${product.quantity > 10 ? 'bg-emerald-500 ring-emerald-500/10' : product.quantity > 0 ? 'bg-amber-500 ring-amber-500/10' : 'bg-red-500 ring-red-500/10'}`} />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{product.quantity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
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
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic">
                    Không tìm thấy sản phẩm nào phù hợp...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        // PAGINATION
        <div className="pagination-container">
          <span className="pagination-info">
            Hiển thị <span className="font-bold text-slate-900 dark:text-white">
              {totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span> - <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * pageSize, totalCount)}</span> trong <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span> sản phẩm
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
