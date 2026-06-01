import {
  FileDown,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Smartphone,
  BatteryCharging,
  Camera,
  Cpu,
  Layers,
  Filter,
} from "lucide-react";
import { useEffect } from "react";
import Button from "../../../components/ui/Button";
import SearchBar from "../../../components/ui/SearchBar";
import Badge from "../../../components/ui/Badge";
import Loading from "../../../components/ui/Loading";
import DataTableCard from "../../../components/ui/DataTableCard.jsx";
import PaginationBar from "../../../components/ui/PaginationBar.jsx";
import { useInventory } from "../hooks/useInventory.jsx";
import { useHeader } from "../../../contexts/HeaderContext";
import { formatNumber } from "../../../utils/util";
import "../styles/Inventory.css";

/**
 * Trang kiểm kê tồn kho
 * Cho phép theo dõi số lượng tồn, cảnh báo tồn thấp và xem giá trị kho
 */
export default function InventoryPage() {
  const {
    products,
    categories,
    stats,
    loading,
    isFirstFetch,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    lowStockOnly,
    setLowStockOnly,
    currentPage,
    setCurrentPage,
    pageSize,
    totalCount,
  } = useInventory();

  const { setActionButton, resetHeader } = useHeader();

  useEffect(() => {
    setActionButton({
      label: "Nhập hàng mới",
      icon: <Plus size={18} />,
      onClick: () => alert("Chức năng nhập hàng mới"),
      searchPlaceholder: "Tìm kiếm sản phẩm...",
      className:
        "shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]",
    });
    return () => resetHeader();
  }, [setActionButton, resetHeader]);

  if (isFirstFetch && loading)
    return <Loading text="Đang tải dữ liệu kiểm kê..." />;

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 4:
        return <Smartphone size={18} className="text-slate-400" />;
      case 5:
        return <BatteryCharging size={18} className="text-slate-400" />;
      case 6:
        return <Camera size={18} className="text-slate-400" />;
      case 7:
        return <Layers size={18} className="text-slate-400" />;
      default:
        return <Cpu size={18} className="text-slate-400" />;
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

      {/* STATS OVERVIEW */}
      <div className="inventory-stats-grid">
        <div className="inventory-stat-card">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
            Tổng mặt hàng
          </p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {formatNumber(stats.totalItems)}
          </p>
        </div>
        <div className="inventory-stat-card border-l-4 border-l-red-500">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
            Sắp hết hàng
          </p>
          <p className="text-2xl font-extrabold text-red-600 dark:text-red-400 mt-2">
            {stats.lowStock}
          </p>
        </div>
        <div className="inventory-stat-card">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
            Tổng giá trị kho
          </p>
          <p className="text-2xl font-extrabold text-primary mt-2">
            {(stats.totalValue / 1000000).toFixed(1)}M
          </p>
        </div>
        <div className="inventory-stat-card">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
            Cập nhật lần cuối
          </p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {stats.lastUpdate}
          </p>
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

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg py-2 pl-3 pr-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Theo nhóm: Tất cả</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-100 dark:border-slate-800 shrink-0">
            <button
              onClick={() => setLowStockOnly(false)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${!lowStockOnly ? "bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setLowStockOnly(true)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${lowStockOnly ? "bg-white dark:bg-slate-700 text-accent-red shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
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
      <DataTableCard className="relative min-h-[500px] flex flex-col">
        <div className="table-wrapper flex-grow">
          <table className="table w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <th className="table-th px-6">Sản phẩm</th>
                <th className="table-th px-6">Nhóm</th>
                <th className="table-th px-6 text-center">Số lượng tồn</th>
                <th className="table-th px-6">Đơn giá (VNĐ)</th>
                <th className="table-th px-6 text-center">Cảnh báo</th>
                <th className="table-th px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y divide-slate-100 dark:divide-slate-800/50 transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}
            >
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:shadow-sm transition-all duration-300">
                          {getCategoryIcon(product.categoryId)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                            {product.name}
                          </p>
                          <p className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            SKU: {product.code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="blue"
                        className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none font-bold text-[10px] uppercase"
                      >
                        {categories.find((c) => c.id === product.categoryId)
                          ?.name || "Linh kiện"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-sm font-black ${product.quantity <= 10 ? "text-accent-red" : "text-slate-900 dark:text-white"}`}
                      >
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                      {formatNumber(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {product.quantity <= 10 ? (
                          <Badge
                            variant="red"
                            className="flex items-center gap-1 animate-pulse py-1 px-3 border-red-200 dark:border-red-900/30"
                          >
                            <span className="w-1.5 h-1.5 bg-accent-red rounded-full" />
                            Tồn thấp
                          </Badge>
                        ) : (
                          <Badge
                            variant="success"
                            className="py-1 px-3 border-emerald-200 dark:border-emerald-950/30"
                          >
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
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-400 italic"
                  >
                    Không tìm thấy dữ liệu tồn kho...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <PaginationBar
          info={
            <p className="pagination-info">
              Hiển thị{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              đến{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {Math.min(currentPage * pageSize, totalCount)}
              </span>{" "}
              trong số{" "}
              <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span> sản phẩm
            </p>
          }
        >
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="pagination-btn disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="pagination-page-list">
              {Array.from({ length: Math.ceil(totalCount / pageSize) || 1 }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-page-btn ${currentPage === page ? "pagination-page-btn-active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage * pageSize >= totalCount}
              className="pagination-btn disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </PaginationBar>
      </DataTableCard>
    </div>
  );
}
