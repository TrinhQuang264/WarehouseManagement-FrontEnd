import PaginationBar from "../../../components/ui/PaginationBar";

export default function CategoriesPagination({
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
}) {
  return (
    <PaginationBar
      currentPage={currentPage}
      pageSize={pageSize}
      totalCount={totalCount}
      onPageChange={onPageChange}
      resourceName="danh mục"
    />
  );
}
