import { useEffect } from "react";
import { FileDown } from "lucide-react";
import { useHeader } from "../../../contexts/HeaderContext";
import { useReports } from "../hooks/useReports";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.jsx";
import { COMMON_URLS } from "../../../constants/urls.js";
import ReportFilters from "../components/ReportFilters.jsx";
import ReportTable from "../components/ReportTable.jsx";
import ReportPagination from "../components/ReportPagination.jsx";

const formatDateString = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
};

export default function ReportsPage() {
  const { setTitle, resetHeader, setActionButton, setOnSearch } = useHeader();

  const {
    reportData,
    columnTotals,
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

  useEffect(() => {
    setTitle("");
    setOnSearch(() => setSearch);
    return () => resetHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="reports-page px-2 md:px-4">
      {/* Breadcrumbs */}
      <div className="page-header mb-4">
        <Breadcrumbs
          items={[
            { label: "Tổng quan", path: COMMON_URLS.dashboard },
            { label: "Báo cáo nhập xuất tồn" },
          ]}
        />
      </div>

      {/* Filter Bar */}
      <ReportFilters
        categories={categories}
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        subtitleDateText={subtitleDateText}
      />

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <ReportTable
            reportData={reportData}
            columnTotals={columnTotals}
            loading={loading}
          />
        </div>
      </div>

      {/* Pagination */}
      {!loading && (
        <ReportPagination
          reportDataLength={reportData.length}
          totalCount={totalCount}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      )}
    </div>
  );
}
