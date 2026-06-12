import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ReportPagination({
  reportDataLength,
  totalCount,
  totalPages,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
}) {
  if (reportDataLength === 0) return null;

  return (
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
          Đang hiển thị {reportDataLength} trên tổng số {totalCount} linh kiện trong kho.
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
                Math.abs(page - currentPage) <= 1
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
  );
}
