import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../../components/ui/ConfirmModal.jsx";
import PaginationBar from "../../../components/ui/PaginationBar.jsx";
import CustomerTable from "../components/CustomerTable.jsx";
import CustomerModal from "../components/CustomerModal.jsx";
import CustomerDetailPage from "../components/CustomerDetailPage.jsx";
import { useCustomers } from "../hooks/useCustomers.jsx";
import { useHeader } from "../../../contexts/HeaderContext.jsx";
import { useAuth } from "../../auth/hooks/useAuth.jsx";
import TrashBinDrawer from "../../../components/ui/TrashBinDrawer.jsx";
import customersService from "../api/customersService.js";
import {
  COMMON_URLS,
  CUSTOMER_URLS,
  EXPORT_URLS,
} from "../../../constants/urls.js";
import "../styles/Customers.css";

function buildCustomerHistory(customerId) {
  const base = [
    {
      id: 1,
      code: "PX-2024-001",
      dateLabel: "14/05/2024",
      totalAmount: 12500000,
      status: "completed",
      statusLabel: "Hoàn tất",
    },
    {
      id: 2,
      code: "PX-2024-005",
      dateLabel: "10/05/2024",
      totalAmount: 8920000,
      status: "pending",
      statusLabel: "Đang giao",
    },
    {
      id: 3,
      code: "PX-2024-010",
      dateLabel: "22/04/2024",
      totalAmount: 45000000,
      status: "completed",
      statusLabel: "Hoàn tất",
    },
    {
      id: 4,
      code: "PX-2024-014",
      dateLabel: "15/04/2024",
      totalAmount: 1200000,
      status: "cancelled",
      statusLabel: "Đã hủy",
    },
    {
      id: 5,
      code: "PX-2024-019",
      dateLabel: "02/04/2024",
      totalAmount: 15600000,
      status: "completed",
      statusLabel: "Hoàn tất",
    },
  ];
  return base.map((item, index) => ({
    ...item,
    id: `${customerId}-${item.id}`,
    totalAmount: item.totalAmount + customerId * 150000 * index,
    href: EXPORT_URLS.detail(index + 1),
  }));
}

export default function CustomersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Gọi các thuộc tính chính xác từ hook mới cập nhật
  const {
    customers, // Danh sách khách hàng đã phân trang
    allActiveCustomers, // Toàn bộ khách hàng chưa xóa
    loading,
    isSubmitting,
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
    isTrashOpen,
    setIsTrashOpen,
    selectedCustomer, // Đại diện chung cho editingCustomer và deletingCustomer
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

  // Trạng thái hiển thị Chi tiết hay Danh sách
  const isDetailMode =
    location.pathname !== CUSTOMER_URLS.list && Boolean(params.id);

  // Tìm khách hàng hiện tại dựa trên ID từ URL params
  const currentCustomer = useMemo(
    () =>
      allActiveCustomers.find(
        (customer) => String(customer.id) === String(params.id),
      ) || null,
    [allActiveCustomers, params.id],
  );

  // Xây dựng lịch sử giao dịch giả lập dựa trên ID khách hàng
  const customerHistory = useMemo(
    () => (currentCustomer ? buildCustomerHistory(currentCustomer.id) : []),
    [currentCustomer],
  );
  const closeTrash = useCallback(() => setIsTrashOpen(false), [setIsTrashOpen]);
  const openTrash = useCallback(() => setIsTrashOpen(true), [setIsTrashOpen]);
  // Hàm handle trung gian kết nối Modal Form với các hàm xử lý Async CRUD của hook
  const handleSaveCustomer = useCallback(
    async (data) => {
      if (selectedCustomer) {
        return await handleUpdateCustomer(selectedCustomer.id, data);
      }
      return await handleAddCustomer(data);
    },
    [handleAddCustomer, handleUpdateCustomer, selectedCustomer],
  );

  // Đồng bộ hóa trạng thái Header Layout với Context toàn cục
  useEffect(() => {
    if (isDetailMode) {
      setActionButton(null);
      setOnSearch(null);
      setTitle(
        currentCustomer
          ? `Chi tiết khách hàng: ${currentCustomer.fullName}`
          : "Chi tiết khách hàng",
      );
    } else {
      setActionButton({
        label: "Thêm khách hàng",
        icon: <Plus size={18} />,
        onClick: () => setIsModalOpen(true), // Mở modal thêm mới với selectedCustomer = null mặc định
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
          : []
      );
      setOnSearch(() => setSearch); // Gắn hook state thay đổi text vào thanh tìm kiếm chung trên Header
      setTitle("");
    }
    return () => resetHeader();
  }, [
    isDetailMode,
    currentCustomer,
    setActionButton,
    setOnSearch,
    setSearch,
    setTitle,
    setExtraActions,
    resetHeader,
    setIsModalOpen,
  ]);

  // --- RENDERING ROUTE: CHI TIẾT KHÁCH HÀNG ---
  if (isDetailMode) {
    if (!currentCustomer) {
      return (
        <div className="customers-page">
          <div className="page-header">
            <nav className="flex text-sm text-slate-500 mb-2">
              <Link
                to={COMMON_URLS.dashboard}
                className="hover:text-primary transition-colors"
              >
                Tổng quan
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <Link
                to={CUSTOMER_URLS.list}
                className="hover:text-primary transition-colors"
              >
                Khách hàng
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-900 font-medium">Không tìm thấy</span>
            </nav>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Khách hàng không tồn tại hoặc đã bị xóa.
          </div>
        </div>
      );
    }

    return (
      <>
        <CustomerDetailPage
          customer={currentCustomer}
          history={customerHistory}
          onEdit={openEditModal}
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
      </>
    );
  }

  // --- RENDERING ROUTE: DANH SÁCH KHÁCH HÀNG ---
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

      {/* Modal Thêm & Sửa khách hàng */}
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

      {/* Modal xác nhận xóa mềm khách hàng */}
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
        title="Thùng rác dữ liệu khách hàng "
        service={customersService}
        onDataChange={refreshList}
        columns={[{ key: "fullName" }]}
      />
    </div>
  );
}
