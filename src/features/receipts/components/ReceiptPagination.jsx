import React from 'react';
import PaginationBar from '../../../components/ui/PaginationBar.jsx';

export default function ReceiptPagination({
  currentPage,
  setCurrentPage,
  pageSize,
  totalCount,
  label,
}) {
  return (
    <PaginationBar
      currentPage={currentPage}
      pageSize={pageSize}
      totalCount={totalCount}
      onPageChange={setCurrentPage}
      resourceName={label || 'chứng từ'}
    />
  );
}
