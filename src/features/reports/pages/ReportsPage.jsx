import React, { useEffect } from "react";
import { useHeader } from "../../../contexts/HeaderContext";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  FileDown,
  Calendar,
} from "lucide-react";
import { useReports } from "../hooks/useReports";
import { formatNumber, formatCurrency } from "../../../utils/util";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.jsx";
import { COMMON_URLS } from "../../../constants/urls.js";

export default function ReportsPage() {
  const { setTitle, resetHeader, setActionButton, setOnSearch } = useHeader();

  const {
    reportData,
    columnTotals,
    dashboardStats,
    categories,
    loading,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    selectedDateRange,
    setSelectedDateRange,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    handleExport,
    dateRange,
  } = useReports();

  // Format date for subtitle
  const formatDateString = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Value formatting helper for billion/million VND
  const formatBillion = (value) => {
    const val = Number(value);
    if (val >= 1_000_000_000) {
      return (
        (val / 1_000_000_000).toLocaleString("vi-VN", {
          maximumFractionDigits: 1,
        }) + " tỷ"
      );
    }
    if (val >= 1_000_000) {
      return (
        (val / 1_000_000).toLocaleString("vi-VN", {
          maximumFractionDigits: 1,
        }) + " triệu"
      );
    }
    return formatNumber(val);
  };

  // Chỉ chạy 1 lần khi mount: đăng ký search lên header
  useEffect(() => {
    setTitle("");
    setOnSearch(() => setSearch);
    return () => resetHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cập nhật actionButton mỗi khi loading hoặc dữ liệu thay đổi (KHÔNG cleanup resetHeader)
  useEffect(() => {
    setActionButton({
      render: () => (
        <button
          onClick={handleExport}
          disabled={loading || reportData.length === 0}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileDown size={14} className="text-slate-500" />
          Xuất Excel
        </button>
      ),
      searchPlaceholder: "Tìm kiếm theo mã hoặc tên linh kiện...",
    });
  }, [setActionButton, handleExport, loading, reportData.length]);

  const subtitleDateText = `Dữ liệu từ ${formatDateString(dateRange.start)} đến ${formatDateString(dateRange.end)}`;

  return (
    <div className="reports-page px-2 md:px-4 py-4">
      {/* Breadcrumbs */}
      <div className="page-header mb-4">
        <Breadcrumbs
          items={[
            { label: "Tổng quan", path: COMMON_URLS.dashboard },
            { label: "Báo cáo nhập xuất tồn" },
          ]}
        />
      </div>

      {/* Filter Bar: Time + Category */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Filter */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Calendar size={13} className="text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Thời gian:
            </span>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="border-none bg-transparent text-xs font-semibold focus:ring-0 p-0 pr-6 cursor-pointer outline-none text-slate-700"
            >
              <option value="month">Tháng này</option>
              <option value="lastMonth">Tháng trước</option>
              <option value="quarter">Quý này</option>
              <option value="custom">Tùy chọn...</option>
            </select>
          </div>

          {/* Custom Date Inputs */}
          {selectedDateRange === "custom" && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="border-none text-xs text-slate-700 bg-transparent p-0 outline-none focus:ring-0"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="border-none text-xs text-slate-700 bg-transparent p-0 outline-none focus:ring-0"
              />
            </div>
          )}

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">
              Danh mục:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-slate-200 rounded-lg text-xs font-semibold py-1.5 px-3 bg-white focus:ring-2 focus:ring-primary/10 cursor-pointer outline-none text-slate-700"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subtitle date range */}
        <p className="text-[11px] text-slate-400 italic hidden md:block">
          {subtitleDateText}
        </p>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-500 font-medium">
              Đang tải dữ liệu báo cáo...
            </div>
          ) : reportData.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-500 font-medium">
              Không tìm thấy dữ liệu linh kiện phù hợp.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-slate-700">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th
                    className="font-bold uppercase tracking-wider text-[10px] border-r border-slate-200 px-3 py-2.5"
                    rowSpan="2"
                  >
                    Mã linh kiện
                  </th>
                  <th
                    className="font-bold uppercase tracking-wider text-[10px] border-r border-slate-200 px-3 py-2.5"
                    rowSpan="2"
                  >
                    Tên linh kiện
                  </th>
                  <th
                    className="text-center font-bold uppercase tracking-wider text-[10px] border-b border-r border-slate-200 py-1.5 bg-slate-50/50"
                    colSpan="2"
                  >
                    Tồn đầu kỳ
                  </th>
                  <th
                    className="text-center font-bold uppercase tracking-wider text-[10px] border-b border-r border-slate-200 py-1.5"
                    colSpan="2"
                  >
                    Nhập trong kỳ
                  </th>
                  <th
                    className="text-center font-bold uppercase tracking-wider text-[10px] border-b border-r border-slate-200 py-1.5 bg-slate-50/50"
                    colSpan="2"
                  >
                    Xuất trong kỳ
                  </th>
                  <th
                    className="text-center font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 py-1.5"
                    colSpan="2"
                  >
                    Tồn cuối kỳ
                  </th>
                </tr>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <th className="text-right font-medium text-[10px] border-r border-slate-200 bg-slate-50/30 px-3 py-2">
                    Số lượng
                  </th>
                  <th className="text-right font-medium text-[10px] border-r border-slate-200 bg-slate-50/30 px-3 py-2">
                    Giá trị
                  </th>
                  <th className="text-right font-medium text-[10px] border-r border-slate-200 px-3 py-2">
                    Số lượng
                  </th>
                  <th className="text-right font-medium text-[10px] border-r border-slate-200 px-3 py-2">
                    Giá trị
                  </th>
                  <th className="text-right font-medium text-[10px] border-r border-slate-200 bg-slate-50/30 px-3 py-2">
                    Số lượng
                  </th>
                  <th className="text-right font-medium text-[10px] border-r border-slate-200 bg-slate-50/30 px-3 py-2">
                    Giá trị
                  </th>
                  <th className="text-right font-medium text-[10px] border-r border-slate-200 px-3 py-2">
                    Số lượng
                  </th>
                  <th className="text-right font-medium text-[10px] px-3 py-2">
                    Giá trị
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {reportData.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="font-mono text-primary font-medium px-3 py-2 text-xs">
                      {row.code}
                    </td>
                    <td className="font-semibold text-slate-900 px-3 py-2 text-xs">
                      {row.name}
                    </td>

                    {/* Tồn đầu kỳ */}
                    <td className="text-right font-mono text-slate-600 bg-slate-50/10 px-3 py-2 text-xs">
                      {formatNumber(row.openingQty)}
                    </td>
                    <td
                      className="text-right font-mono text-slate-600 bg-slate-50/10 px-3 py-2 text-xs cursor-help"
                      title={formatCurrency(row.openingVal)}
                    >
                      {formatCurrency(row.openingVal)}
                    </td>

                    {/* Nhập trong kỳ */}
                    <td className="text-right font-mono text-slate-900 px-3 py-2 text-xs font-semibold">
                      {formatNumber(row.importQty)}
                    </td>
                    <td
                      className="text-right font-mono text-slate-900 px-3 py-2 text-xs cursor-help font-semibold"
                      title={formatCurrency(row.importVal)}
                    >
                      {formatCurrency(row.importVal)}
                    </td>

                    {/* Xuất trong kỳ */}
                    <td className="text-right font-mono text-slate-600 bg-slate-50/10 px-3 py-2 text-xs">
                      {formatNumber(row.exportQty)}
                    </td>
                    <td
                      className="text-right font-mono text-slate-600 bg-slate-50/10 px-3 py-2 text-xs cursor-help"
                      title={formatCurrency(row.exportVal)}
                    >
                      {formatCurrency(row.exportVal)}
                    </td>

                    {/* Tồn cuối kỳ */}
                    <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">
                      {formatNumber(row.closingQty)}
                    </td>
                    <td
                      className="text-right font-mono font-bold text-primary px-3 py-2 text-xs cursor-help"
                      title={formatCurrency(row.closingVal)}
                    >
                      {formatCurrency(row.closingVal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 border-t-2 border-primary/20 text-slate-900">
                  <td
                    className="font-bold uppercase tracking-wider text-[10px] py-3 pl-4"
                    colSpan="2"
                  >
                    Tổng cộng cuối kỳ
                  </td>
                  <td className="text-right font-mono font-bold bg-slate-50/50 px-3 py-2 text-xs">
                    {formatNumber(columnTotals.openingQty)}
                  </td>
                  <td
                    className="text-right font-mono font-bold bg-slate-50/50 px-3 py-2 text-xs cursor-help"
                    title={formatCurrency(columnTotals.openingVal)}
                  >
                    {formatCurrency(columnTotals.openingVal)}
                  </td>
                  <td className="text-right font-mono font-bold px-3 py-2 text-xs">
                    {formatNumber(columnTotals.importQty)}
                  </td>
                  <td
                    className="text-right font-mono font-bold px-3 py-2 text-xs cursor-help"
                    title={formatCurrency(columnTotals.importVal)}
                  >
                    {formatCurrency(columnTotals.importVal)}
                  </td>
                  <td className="text-right font-mono font-bold bg-slate-50/50 px-3 py-2 text-xs">
                    {formatNumber(columnTotals.exportQty)}
                  </td>
                  <td
                    className="text-right font-mono font-bold bg-slate-50/50 px-3 py-2 text-xs cursor-help"
                    title={formatCurrency(columnTotals.exportVal)}
                  >
                    {formatCurrency(columnTotals.exportVal)}
                  </td>
                  <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">
                    {formatNumber(columnTotals.closingQty)}
                  </td>
                  <td
                    className="text-right font-mono font-bold text-primary px-3 py-2 text-xs cursor-help"
                    title={formatCurrency(columnTotals.closingVal)}
                  >
                    {formatCurrency(columnTotals.closingVal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {!loading && reportData.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Hiển thị:
              </span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border border-slate-200 bg-white text-[11px] font-bold py-1 px-2 rounded-lg focus:ring-primary/20 cursor-pointer outline-none text-slate-700"
              >
                <option value={5}>5 dòng</option>
                <option value={10}>10 dòng</option>
                <option value={20}>20 dòng</option>
                <option value={50}>50 dòng</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500 font-medium italic">
              Đang hiển thị {reportData.length} trên tổng số {totalCount} linh
              kiện trong kho.
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-primary transition-colors active:scale-95 disabled:opacity-50 disabled:hover:text-slate-400"
            >
              <ChevronLeft size={14} />
            </button>
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1,
                )
                .map((page, index, arr) => {
                  const showEllipsis = index > 0 && page - arr[index - 1] > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && (
                        <span className="text-slate-400 px-1 text-xs">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-[11px] font-bold transition-all ${
                          currentPage === page
                            ? "bg-primary text-white shadow-sm"
                            : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-primary transition-colors active:scale-95 disabled:opacity-50 disabled:hover:text-slate-400"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Card 1: Tồn kho hiện tại */}
        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between gap-3 hover:shadow-md transition-shadow">
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 truncate">
              Tồn kho hiện tại
            </p>
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              {formatNumber(dashboardStats.totalStock)}
            </h3>
            <p
              className={`text-[9px] font-bold mt-0.5 truncate ${
                Number(dashboardStats.stockPercentChange) >= 0
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {Number(dashboardStats.stockPercentChange) >= 0 ? "+" : ""}
              {dashboardStats.stockPercentChange}% tháng trước
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm flex-shrink-0">
            📦
          </div>
        </div>

        {/* Card 2: Tổng giá trị tồn */}
        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between gap-3 hover:shadow-md transition-shadow">
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 truncate">
              Tổng giá trị tồn
            </p>
            <h3
              className="text-lg font-black text-slate-900 leading-tight cursor-help truncate"
              title={formatCurrency(dashboardStats.totalVal)}
            >
              {formatBillion(dashboardStats.totalVal)}
            </h3>
            <p className="text-[9px] text-green-600 font-bold mt-0.5">
              Giá nhập ban đầu
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-sm flex-shrink-0">
            💰
          </div>
        </div>

        {/* Card 3: Số lượt nhập kho */}
        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between gap-3 hover:shadow-md transition-shadow">
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 truncate">
              Số lượt nhập kho
            </p>
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              {dashboardStats.importCount}
            </h3>
            <p className="text-[9px] text-slate-400 font-medium mt-0.5 truncate">
              ~{dashboardStats.averageImportsPerDay} phiếu/ngày
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm flex-shrink-0">
            📥
          </div>
        </div>

        {/* Card 4: Sản phẩm sắp hết */}
        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between gap-3 hover:shadow-md transition-shadow">
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 truncate">
              Sản phẩm sắp hết
            </p>
            <h3
              className={`text-lg font-black leading-tight ${dashboardStats.lowStockCount > 0 ? "text-red-500" : "text-slate-900"}`}
            >
              {dashboardStats.lowStockCount}
            </h3>
            <p
              className={`text-[9px] font-bold mt-0.5 ${
                dashboardStats.lowStockCount > 0
                  ? "text-red-500"
                  : "text-slate-400"
              }`}
            >
              {dashboardStats.lowStockCount > 0
                ? "Cần nhập ngưay"
                : "Tồn kho an toàn"}
            </p>
          </div>
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
              dashboardStats.lowStockCount > 0 ? "bg-red-50" : "bg-slate-50"
            }`}
          >
            ⚠️
          </div>
        </div>
      </div>
    </div>
  );
}
