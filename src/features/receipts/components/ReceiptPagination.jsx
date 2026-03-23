import { ChevronLeft, ChevronRight } from 'lucide-react';
import PaginationBar from '../../../components/ui/PaginationBar.jsx';

export default function ReceiptPagination({
  currentPage,
  setCurrentPage,
  pageSize,
  totalCount,
  totalPages,
  label,
}) {
  const start = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(currentPage * pageSize, totalCount);
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => index + 1);

  return (
    <PaginationBar
      info={(
        <span className="pagination-info">
          Hiển thị <span className="font-bold text-slate-900 dark:text-white">{start}</span> - <span className="font-bold text-slate-900 dark:text-white">{end}</span> của <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span> {label}
        </span>
      )}
    >
      <div className="pagination-controls">
        <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="pagination-btn">
          <ChevronLeft size={18} />
        </button>

        <div className="pagination-page-list">
          {pages.map((page) => (
            <button key={page} type="button" className={`pagination-page-btn ${currentPage === page ? 'pagination-page-btn-active' : ''}`} onClick={() => setCurrentPage(page)}>
              {page}
            </button>
          ))}
        </div>

        <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage >= totalPages || totalCount === 0} className="pagination-btn">
          <ChevronRight size={18} />
        </button>
      </div>
    </PaginationBar>
  );
}
