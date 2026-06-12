import React, { useCallback, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import PaginationBar from "../../../components/ui/PaginationBar";
import TrashBinDrawer from "../../../components/ui/TrashBinDrawer";
import SupplierTable from "../components/SupplierTable";
import SupplierModal from "../components/SupplierModal";
import { useSuppliers } from "../hooks/useSuppliers.jsx";
import { useHeader } from "../../../contexts/HeaderContext";
import { useAuth } from "../../auth/hooks/useAuth.jsx";
import suppliersService from "../api/suppliersService";
import { SUPPLIER_URLS } from "../../../constants/urls.js";
import "../styles/Suppliers.css";

export default function SuppliersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const navigate = useNavigate();
  const {
    suppliers,
    loading,
    isSubmitting,
    isFirstFetch,
    setSearch,
    currentPage,
    setCurrentPage,
    pageSize,
    totalCount,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedSupplier,
    setSelectedSupplier,
    handleAddSupplier,
    handleUpdateSupplier,
    handleDeleteSupplier,
    openEditModal,
    openDeleteModal,
    isTrashOpen,
    setIsTrashOpen,
    refreshList,
  } = useSuppliers();

  const {
    setActionButton,
    setExtraActions,
    setOnSearch,
    setTitle,
    resetHeader,
  } = useHeader();

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  }, [setIsModalOpen, setSelectedSupplier]);

  const openCreateModal = useCallback(() => {
    setSelectedSupplier(null);
    setIsModalOpen(true);
  }, [setIsModalOpen, setSelectedSupplier]);

  const closeTrash = useCallback(() => setIsTrashOpen(false), [setIsTrashOpen]);
  const openTrash = useCallback(() => setIsTrashOpen(true), [setIsTrashOpen]);

  const handleSaveSupplier = useCallback(
    (data) => {
      if (selectedSupplier)
        return handleUpdateSupplier(selectedSupplier.id, data);
      return handleAddSupplier(data);
    },
    [handleAddSupplier, handleUpdateSupplier, selectedSupplier],
  );

  useEffect(() => {
    setActionButton({
      label: "Thêm nhà cung cấp",
      icon: <Plus size={18} />,
      onClick: () => {
        openCreateModal();
      },
      searchPlaceholder: "Tìm kiếm nhà cung cấp...",
      className: "shadow-lg shadow-primary/20",
    });
    setExtraActions(
      isAdmin
        ? [
            {
              label: "Thùng rác",
              icon: <Trash2 size={18} />,
              onClick: openTrash,
              variant: "danger",
            },
          ]
        : []
    );
    setOnSearch(() => setSearch);
    setTitle("");
    return () => resetHeader();
  }, [
    setActionButton,
    setExtraActions,
    setOnSearch,
    setTitle,
    resetHeader,
    setIsModalOpen,
    setIsTrashOpen,
    setSelectedSupplier,
    setSearch,
    openCreateModal,
    openTrash,
    isAdmin,
  ]);

  if (isFirstFetch && loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="suppliers-page">
        <div className="page-header">
          <Breadcrumbs />
        </div>

        <SupplierTable
          suppliers={suppliers}
          loading={loading}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          showDelete={isAdmin}
        />

        <PaginationBar
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          resourceName="nhà cung cấp"
        />

        <SupplierModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveSupplier}
          editingSupplier={selectedSupplier}
        />

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteSupplier}
          title="Xác nhận xóa nhà cung cấp"
          message={`Bạn có chắc chắn muốn xóa nhà cung cấp "${selectedSupplier?.supplierName}"? Dữ liệu sẽ được chuyển vào thùng rác.`}
          confirmText="Xóa"
          variant="danger"
          loading={isSubmitting}
        />
      </div>

      <TrashBinDrawer
        isOpen={isTrashOpen}
        onClose={closeTrash}
        title="Thùng rác dữ liệu nhà cung cấp"
        service={suppliersService}
        onDataChange={refreshList}
        columns={[{ key: "supplierName" }]}
      />
    </>
  );
}
