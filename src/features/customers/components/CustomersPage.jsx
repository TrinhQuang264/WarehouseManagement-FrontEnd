import React, { useEffect, useMemo } from "react";
import { Plus, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import CustomerTable from "./CustomerTable";
import CustomerModal from "./CustomerModal";
import CustomerDetailPage from "./CustomerDetailPage.jsx";
import TrashBinDrawer from "../../../components/ui/TrashBinDrawer";
import { useCustomers } from "../hooks/useCustomers.jsx";
import { useHeader } from "../../../contexts/HeaderContext";
import customersService from "../api/customersService";
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
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const {
    customers,
    isFetching,
    isSubmitting,
    setSearch,
    currentPage,
    setCurrentPage,
    totalCount,
    totalPages,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedCustomer,
    openEditModal,
    openDeleteModal,
    handleAddCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer,
    nextCode,
    isTrashOpen,
    setIsTrashOpen,
    refreshList,
  } = useCustomers();

  const { setActionButton, setExtraActions, setOnSearch, setTitle, resetHeader } = useHeader();

  const isDetailMode =
    location.pathname !== CUSTOMER_URLS.list && Boolean(params.id);

  const currentCustomer = useMemo(
    () =>
      customers.find((customer) => String(customer.id) === String(params.id)) ||
      null,
    [customers, params.id],
  );

  const customerHistory = useMemo(
    () => (currentCustomer ? buildCustomerHistory(currentCustomer.id) : []),
    [currentCustomer],
  );

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
        onClick: () => openEditModal(null),
        searchPlaceholder: "Tìm kiếm khách hàng...",
        className:
          "shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]",
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
      setTitle("");
    }
    return () => resetHeader();
  }, [
    isDetailMode,
    currentCustomer,
    setActionButton,
    setExtraActions,
    setOnSearch,
    setTitle,
    resetHeader,
    setSearch,
    openEditModal,
    setIsTrashOpen,
  ]);

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
                Trang chủ
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <Link
                to={CUSTOMER_URLS.list}
                className="hover:text-primary transition-colors"
              >
                Khách hàng
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-900 dark:text-white font-medium">
                Không tìm thấy
              </span>
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
          onClose={() => setIsModalOpen(false)}
          onSave={selectedCustomer?.id ? (data) => handleUpdateCustomer(selectedCustomer.id, data) : handleAddCustomer}
          editingCustomer={selectedCustomer}
          nextCode={nextCode}
          isSubmitting={isSubmitting}
        />
      </>
    );
  }

  return (
    <div className="customers-page">
      <CustomerTable
        customers={customers}
        loading={isFetching}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onViewDetail={(customer) => navigate(CUSTOMER_URLS.detail(customer.id))}
      />

      <div className="pagination-container">
        <span className="pagination-info">
          Hiển thị{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {(currentPage - 1) * 7 + 1}-{Math.min(currentPage * 7, totalCount)}
          </span>{" "}
          của{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {totalCount}
          </span>{" "}
          kết quả
        </span>
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="pagination-btn disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="pagination-page-list">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`pagination-page-btn ${
                  currentPage === page ? "pagination-page-btn-active" : ""
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="pagination-btn disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={selectedCustomer?.id ? (data) => handleUpdateCustomer(selectedCustomer.id, data) : handleAddCustomer}
        editingCustomer={selectedCustomer}
        nextCode={nextCode}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCustomer}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa khách hàng "${selectedCustomer?.fullName}"? Toàn bộ dữ liệu liên quan sẽ không thể phục hồi.`}
        confirmLabel="Vâng, Xóa ngay"
      />

      <TrashBinDrawer 
        isOpen={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        title="Thùng rác khách hàng"
        service={customersService}
        onDataChange={refreshList}
        columns={[
          { label: 'Số điện thoại', key: 'phoneNumber' },
          { label: 'Email', key: 'email' }
        ]}
      />
    </div>
  );
}
