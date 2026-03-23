import ReceiptPagination from '../../receipts/components/ReceiptPagination.jsx';

export default function ImportPagination({
  currentPage,
  setCurrentPage,
  pageSize,
  totalCount,
  totalPages,
}) {
  return <ReceiptPagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageSize={pageSize} totalCount={totalCount} totalPages={totalPages} label="phiếu nhập" />;
}
