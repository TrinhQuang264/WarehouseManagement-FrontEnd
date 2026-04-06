import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useCategories } from "../hooks/useCategories.jsx";
import { useHeader } from "../../../contexts/HeaderContext";
import CategoriesPageLayout from "../components/CategoriesPageLayout";
import TrashBinDrawer from "../../../components/ui/TrashBinDrawer";
import categoryService from "../api/categoriesService";
import "../styles/Categories.css";

export default function CategoriesPage() {
  // Categories module state/actions
  const {
    categories,
    loading,
    isFirstFetch,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    pageSize,
    totalCount,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedCategory,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleBulkSoftDelete,
    openEditModal,
    openDeleteModal,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    isTrashOpen,
    setIsTrashOpen,
    allActiveCategories,
    refreshList,
  } = useCategories();

  // Header controls for page-level actions/search
  const { setActionButton, setExtraActions, setOnSearch, resetHeader } = useHeader();

  useEffect(() => {
    setActionButton({
      label: "Thêm danh mục",
      icon: <Plus size={18} />,
      onClick: () => setIsModalOpen(true),
      searchPlaceholder: "Tìm kiếm tên danh mục...",
      className: "shadow-lg shadow-primary/20",
    });

    setExtraActions([
      {
        label: "Thùng rác",
        icon: <Trash2 size={18} />,
        onClick: () => setIsTrashOpen(true),
        className: "bg-red-500 text-red-600 hover:bg-red-300",
      }
    ]);

    setOnSearch(() => setSearch);

    return () => resetHeader();
  }, [setActionButton, setExtraActions, setOnSearch, setSearch, resetHeader, setIsModalOpen, setIsTrashOpen]);

  if (isFirstFetch && loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <CategoriesPageLayout
        categories={categories}
        allActiveCategories={allActiveCategories}
        loading={loading}
        searchTerm={search}
        currentPage={currentPage}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setCurrentPage}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        isModalOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
        onSaveCategory={(data) => {
          if (selectedCategory)
            return handleUpdateCategory(selectedCategory.id, data);
          return handleAddCategory(data);
        }}
        editingCategory={selectedCategory}
        isDeleteModalOpen={isDeleteModalOpen}
        onCloseDeleteModal={() => setIsDeleteModalOpen(false)}
        onDeleteCategory={handleDeleteCategory}
        selectedCategory={selectedCategory}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        toggleSelectAll={toggleSelectAll}
        onBulkDelete={handleBulkSoftDelete}
      />

      <TrashBinDrawer 
        isOpen={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        title="Thùng rác danh mục"
        service={categoryService}
        onDataChange={refreshList}
        columns={[
          { label: 'Thứ tự', key: 'sortOrder' }
        ]}
      />
    </>
  );
}
