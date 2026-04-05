import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useCategories } from "../hooks/useCategories.jsx";
import { useHeader } from "../../../contexts/HeaderContext";
import CategoriesPageLayout from "../components/CategoriesPageLayout";
import "../styles/Categories.css";

export default function CategoriesPage() {
  const {
    categories,
    loading,
    isFirstFetch,
    search,
    debouncedSearch,
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
    openEditModal,
    openDeleteModal,
  } = useCategories();

  const { setTitle, setSubtitle, setActionButton, setOnSearch, resetHeader } = useHeader();

  useEffect(() => {
      setActionButton({
      label: "Thêm danh mục",
      icon: <Plus size={18} />,
      onClick: () => setIsModalOpen(true),
      searchPlaceholder: "Tìm kiếm tên danh mục...",
      className:
        "shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]",
    });

    setOnSearch(() => setSearch);

    return () => resetHeader();
  }, [setTitle, setSubtitle, setActionButton, setOnSearch, setSearch, resetHeader, setIsModalOpen]);

  if (isFirstFetch && loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <CategoriesPageLayout
      categories={categories}
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
    />
  );
}
