import { ChevronLeft, ChevronRight } from 'lucide-react';
import PaginationBar from '../../../components/ui/PaginationBar.jsx';

export default function ProductsPagination({
  currentPage,
  setCurrentPage,
  pageSize,
  totalCount
}) {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <PaginationBar
      info={
        <span className="pagination-info">
          Hiển thị <span className="font-bold text-slate-900 dark:text-white">
            {totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </span> - <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * pageSize, totalCount)}</span> trong <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span> sản phẩm
        </span>
      }
    >
      <div className="pagination-controls">
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="pagination-page-list">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
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
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages || totalCount === 0}
          className="pagination-btn"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </PaginationBar>
  );
}
