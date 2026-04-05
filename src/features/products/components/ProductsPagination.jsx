import React from 'react';
import PaginationBar from '../../../components/ui/PaginationBar.jsx';

export default function ProductsPagination({
  currentPage,
  setCurrentPage,
  pageSize,
  totalCount
}) {
  return (
    <PaginationBar
      currentPage={currentPage}
      pageSize={pageSize}
      totalCount={totalCount}
      onPageChange={setCurrentPage}
      resourceName="sản phẩm"
    />
  );
}
