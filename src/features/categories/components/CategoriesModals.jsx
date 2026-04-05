import ConfirmModal from "../../../components/ui/ConfirmModal";
import CategoryModal from "../components/CategoryModal";

export default function CategoriesModals({
  isModalOpen,
  onCloseModal,
  onSaveCategory,
  editingCategory,
  isDeleteModalOpen,
  onCloseDeleteModal,
  onDeleteCategory,
  selectedCategory,
  loading,
}) {
  return (
    <>
      <CategoryModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onSave={onSaveCategory}
        editingCategory={editingCategory}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        onConfirm={onDeleteCategory}
        title="Xác nhận xóa danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục "${selectedCategory?.name}"? Dữ liệu sẽ được chuyển vào thùng rác.`}
        confirmText="Xác nhận xóa"
        variant="danger"
        loading={loading}
      />
    </>
  );
}
