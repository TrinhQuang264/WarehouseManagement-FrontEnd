import React, { useEffect, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import ConfirmModal from "../../../components/ui/ConfirmModal.jsx";
import PaginationBar from "../../../components/ui/PaginationBar.jsx";
import CustomerTable from "../components/CustomerTable.jsx";
import CustomerModal from "../components/CustomerModal.jsx";
import { useCustomers } from "../hooks/useCustomers.jsx";
import { useHeader } from "../../../contexts/HeaderContext.jsx";
import { useAuth } from "../../auth/hooks/useAuth.jsx";
import TrashBinDrawer from "../../../components/ui/TrashBinDrawer.jsx";
import customersService from "../api/customersService.js";

import "../styles/Customers.css";

export default function CustomersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const {
    customers,
    loading,
    isSubmitting,
    setSearch,
    currentPage,
    setCurrentPage,
    pageSize,
    totalCount,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isTrashOpen,
    setIsTrashOpen,
    selectedCustomer,
    setSelectedCustomer,
    handleAddCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer,
    openEditModal,
    openDeleteModal,
    nextCode,
    refreshList,
  } = useCustomers();

  const {
    setActionButton,
    setOnSearch,
    setTitle,
    resetHeader,
    setExtraActions,
  } = useHeader();

  const closeTrash = useCallback(() => {
    setIsTrashOpen(false);
  }, [setIsTrashOpen]);

  const openTrash = useCallback(() => {
    setIsTrashOpen(true);
  }, [setIsTrashOpen]);

  const handleSaveCustomer = useCallback(
    async (data) => {
      if (selectedCustomer) {
        return await handleUpdateCustomer(selectedCustomer.id, data);
      }

      return await handleAddCustomer(data);
    },
    [handleAddCustomer, handleUpdateCustomer, selectedCustomer],
  );

  useEffect(() => {
    setActionButton({
      label: "Thêm khách hàng",
      icon: <Plus size={18} />,
      onClick: () => setIsModalOpen(true),
      searchPlaceholder: "Tìm kiếm khách hàng...",
      className:
        "shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]",
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
        : [],
    );

    setOnSearch(() => setSearch);
    setTitle("");

    return () => resetHeader();
  }, [
    isAdmin,
    openTrash,
    resetHeader,
    setActionButton,
    setExtraActions,
    setIsModalOpen,
    setOnSearch,
    setSearch,
    setTitle,
  ]);

  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2">
            <Link to="/" className="hover:text-primary transition-colors">
              Tổng quan
            </Link>

            <span className="mx-2 text-slate-300">/</span>

            <span className="text-slate-900 font-medium">Khách hàng</span>
          </nav>
        </div>
      </div>

      <CustomerTable
        customers={customers}
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
        resourceName="khách hàng"
      />

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSave={handleSaveCustomer}
        editingCustomer={selectedCustomer}
        nextCode={nextCode}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCustomer(null);
        }}
        onConfirm={handleDeleteCustomer}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa khách hàng "${selectedCustomer?.fullName}"? Toàn bộ dữ liệu liên quan sẽ không thể phục hồi.`}
        confirmLabel="Xóa"
        isSubmitting={isSubmitting}
      />

      <TrashBinDrawer
        isOpen={isTrashOpen}
        onClose={closeTrash}
        title="Thùng rác dữ liệu khách hàng"
        service={customersService}
        onDataChange={refreshList}
        columns={[{ key: "fullName" }]}
      />
    </div>
  );
}
