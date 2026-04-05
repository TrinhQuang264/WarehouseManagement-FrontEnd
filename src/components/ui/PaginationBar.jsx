import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * PaginationBar - Shared component for pagination across all modules.
 * Handles display logic, page range generation, and info summary.
 */
export default function PaginationBar({
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  resourceName = 'kết quả',
  info,
  className = '',
  children
}) {
  const totalPages = Math.ceil(totalCount / pageSize);

  // Generate page list with ellipsis
  const buildPageList = () => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const delta = 1; // số trang hiển thị xung quanh currentPage

  const rangeStart = Math.max(2, currentPage - delta);
  const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);

  if (rangeStart > 2) pages.push('left-ellipsis');

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < totalPages - 1) pages.push('right-ellipsis');

  pages.push(totalPages);

  return pages;
};
  if (totalCount === 0) return null;

  return (
    <div className={`pagination-container bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Left: Resource Info */}
      <div className="flex items-center gap-4">
        {info ? info : (
          <span className="text-sm text-slate-500 font-medium">
            Tổng cộng
            <span className="text-slate-900 dark:text-white mx-1 font-bold">{totalCount}</span>
            {resourceName}
          </span>
        )}
      </div>
      
      {/* Right: Page Info & Buttons */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500 font-medium hidden lg:inline">
          Trang <span className="text-slate-900 dark:text-white font-bold">{currentPage}</span> / {totalPages}
        </span>

        <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-1 rounded-lg border border-slate-100 dark:border-slate-700">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            aria-label="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page List */}
          <div className="flex items-center px-1">
            {buildPageList().map((page, idx) => (
              page === 'left-ellipsis' || page === 'right-ellipsis' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">...</span>
              ) : (
                <button
                  key={`page-${page}`}
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold transition-all
                    ${page === currentPage 
                      ? 'bg-primary text-white shadow-md shadow-primary/30' 
                      : 'hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            aria-label="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
