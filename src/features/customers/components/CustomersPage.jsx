import React, { useEffect, useMemo } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import CustomerTable from "./CustomerTable";
import CustomerModal from "./CustomerModal";
import CustomerDetailPage from "./CustomerDetailPage.jsx";
import { useCustomers } from "../hooks/useCustomers.jsx";
import { useHeader } from "../../../contexts/HeaderContext";
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
    filteredCustomers,
    customers,
    isFormOpen,
    setIsFormOpen,
    editingCustomer,
    isDeleteOpen,
    setIsDeleteOpen,
    deletingCustomer,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleOpenDelete,
    confirmDelete,
    searchCustomers,
    nextCode,
  } = useCustomers();

  const { setActionButton, setOnSearch, setTitle, resetHeader } = useHeader();
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
        onClick: handleOpenAdd,
        searchPlaceholder: "Tìm kiếm khách hàng...",
        className:
          "shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]",
      });
      setOnSearch(searchCustomers);
      setTitle("");
    }
    return () => resetHeader();
  }, [
    isDetailMode,
    currentCustomer,
    setActionButton,
    setOnSearch,
    setTitle,
    resetHeader,
    handleOpenAdd,
    searchCustomers,
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
          onEdit={handleOpenEdit}
        />
        <CustomerModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          editingCustomer={editingCustomer}
          nextCode={nextCode}
        />
      </>
    );
  }

  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2">
            <Link to="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 dark:text-white font-medium">
              Khách hàng
            </span>
          </nav>
        </div>
      </div>

      <CustomerTable
        customers={filteredCustomers}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onViewDetail={(customer) => navigate(CUSTOMER_URLS.detail(customer.id))}
      />

      <div className="pagination-container">
        <span className="pagination-info">
          Hiển thị{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            1-{filteredCustomers.length}
          </span>{" "}
          của{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {customers.length}
          </span>{" "}
          kết quả
        </span>
        <div className="pagination-controls">
          <button className="pagination-btn">
            <ChevronLeft size={18} />
          </button>
          <div className="pagination-page-list">
            <button className="pagination-page-btn pagination-page-btn-active">
              1
            </button>
            <button className="pagination-page-btn">2</button>
            <button className="pagination-page-btn">3</button>
          </div>
          <button className="pagination-btn">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <CustomerModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        editingCustomer={editingCustomer}
        nextCode={nextCode}
      />
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa khách hàng "${deletingCustomer?.fullName}"? Toàn bộ dữ liệu liên quan sẽ không thể phục hồi.`}
        confirmLabel="Vâng, Xóa ngay"
      />
    </div>
  );
}
