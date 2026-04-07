import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import CategoriesTableSection from "./CategoriesTableSection";
import CategoriesPagination from "./CategoriesPagination";
import CategoriesModals from "./CategoriesModals";

export default function CategoriesPageLayout({
  categories,
  loading,
  searchTerm,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onEdit,
  onDelete,
  isModalOpen,
  onCloseModal,
  onSaveCategory,
  editingCategory,
  isDeleteModalOpen,
  onCloseDeleteModal,
  onDeleteCategory,
  selectedCategory,
  modalLoading,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
  onBulkDelete,
  allActiveCategories = [],
}) {
  return (
    <div className="categories-page">
      <div className="page-header">
        <Breadcrumbs />
      </div>

      <CategoriesTableSection
        categories={categories}
        loading={loading}
        onEdit={onEdit}
        onDelete={onDelete}
        searchTerm={searchTerm}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        toggleSelectAll={toggleSelectAll}
        onBulkDelete={onBulkDelete}
      />

      <div className="">
        <CategoriesPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={onPageChange}
        />
      </div>

      <CategoriesModals
        isModalOpen={isModalOpen}
        onCloseModal={onCloseModal}
        onSaveCategory={onSaveCategory}
        editingCategory={editingCategory}
        isDeleteModalOpen={isDeleteModalOpen}
        onCloseDeleteModal={onCloseDeleteModal}
        onDeleteCategory={onDeleteCategory}
        selectedCategory={selectedCategory}
        loading={modalLoading}
        allCategories={allActiveCategories}
      />
    </div>
  );
}
