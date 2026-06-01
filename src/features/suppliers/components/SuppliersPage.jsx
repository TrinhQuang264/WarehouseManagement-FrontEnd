<<<<<<< HEAD
import React from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import SupplierTable from './SupplierTable';
import SupplierModal from './SupplierModal';
import { useSuppliers } from '../hooks/useSuppliers.jsx';
import '../styles/Suppliers.css';

export default function SuppliersPage() {
  const {
    suppliers,
=======
import React, { useEffect, useMemo } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import SupplierTable from "./SupplierTable";
import SupplierModal from "./SupplierModal";
import SupplierDetailPage from "./SupplierDetailPage.jsx";
import { useSuppliers } from "../hooks/useSuppliers.jsx";
import { useHeader } from "../../../contexts/HeaderContext";
import {
  COMMON_URLS,
  IMPORT_URLS,
  SUPPLIER_URLS,
} from "../../../constants/urls.js";
import "../styles/Suppliers.css";

function buildSupplierHistory(supplierId) {
  const base = [
    {
      id: 1,
      code: "PN-2024-001",
      dateLabel: "14/03/2024",
      totalAmount: 45000000,
      status: "completed",
      statusLabel: "Hoàn thành",
    },
    {
      id: 2,
      code: "PN-2024-005",
      dateLabel: "10/03/2024",
      totalAmount: 120000000,
      status: "pending",
      statusLabel: "Chờ thanh toán",
    },
    {
      id: 3,
      code: "PN-2024-012",
      dateLabel: "02/03/2024",
      totalAmount: 12500000,
      status: "completed",
      statusLabel: "Hoàn thành",
    },
    {
      id: 4,
      code: "PN-2023-998",
      dateLabel: "25/02/2024",
      totalAmount: 88200000,
      status: "completed",
      statusLabel: "Hoàn thành",
    },
  ];
  return base.map((item, index) => ({
    ...item,
    id: `${supplierId}-${item.id}`,
    totalAmount: item.totalAmount + supplierId * 220000 * index,
    href: IMPORT_URLS.detail(index + 1),
  }));
}

export default function SuppliersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const {
    suppliers,
    filteredSuppliers,
>>>>>>> c9d4396b0eea2861fbc38a435f7cd5d40ab73b2a
    isFormOpen,
    setIsFormOpen,
    editingSupplier,
    isDeleteOpen,
    setIsDeleteOpen,
    deletingSupplier,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleOpenDelete,
    confirmDelete,
<<<<<<< HEAD
    nextCode
  } = useSuppliers();

  return (
    <div className="suppliers-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2">
            <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 dark:text-white font-medium">Nhà cung cấp</span>
          </nav>
          <h1 className="page-title">Danh sách Nhà cung cấp</h1>
          <p className="page-subtitle">Quản lý và cập nhật thông tin các đối tác cung ứng của bạn</p>
        </div>
        <Button onClick={handleOpenAdd} icon={<Plus size={18} />} className="shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
          Thêm nhà cung cấp
        </Button>
      </div>

      {/* TABLE CONTENT */}
      <SupplierTable 
        suppliers={suppliers} 
        onEdit={handleOpenEdit} 
        onDelete={handleOpenDelete} 
      />

      {/* PAGINATION */}
      <div className="pagination-container">
        <span className="pagination-info">
          Hiển thị <span className="font-bold text-slate-900 dark:text-white">1-{suppliers.length}</span> của <span className="font-bold text-slate-900 dark:text-white">48</span> kết quả
=======
    searchSuppliers,
    nextCode,
  } = useSuppliers();

  const { setActionButton, setOnSearch, setTitle, resetHeader } = useHeader();
  const isDetailMode =
    location.pathname !== SUPPLIER_URLS.list && Boolean(params.id);
  const currentSupplier = useMemo(
    () =>
      suppliers.find((supplier) => String(supplier.id) === String(params.id)) ||
      null,
    [suppliers, params.id],
  );
  const supplierHistory = useMemo(
    () => (currentSupplier ? buildSupplierHistory(currentSupplier.id) : []),
    [currentSupplier],
  );

  useEffect(() => {
    if (isDetailMode) {
      setActionButton(null);
      setOnSearch(null);
      setTitle(
        currentSupplier
          ? `Chi tiết nhà cung cấp: ${currentSupplier.supplierName}`
          : "Chi tiết nhà cung cấp",
      );
    } else {
      setActionButton({
        label: "Thêm nhà cung cấp",
        icon: <Plus size={18} />,
        onClick: handleOpenAdd,
        searchPlaceholder: "Tìm kiếm nhà cung cấp...",
        className:
          "shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]",
      });
      setOnSearch(searchSuppliers);
      setTitle("");
    }
    return () => resetHeader();
  }, [
    isDetailMode,
    currentSupplier,
    setActionButton,
    setOnSearch,
    setTitle,
    resetHeader,
    handleOpenAdd,
    searchSuppliers,
  ]);

  if (isDetailMode) {
    if (!currentSupplier) {
      return (
        <div className="suppliers-page">
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
                to={SUPPLIER_URLS.list}
                className="hover:text-primary transition-colors"
              >
                Nhà cung cấp
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-900 dark:text-white font-medium">
                Không tìm thấy
              </span>
            </nav>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Nhà cung cấp không tồn tại hoặc đã bị xóa.
          </div>
        </div>
      );
    }

    return (
      <>
        <SupplierDetailPage
          supplier={currentSupplier}
          history={supplierHistory}
          onEdit={handleOpenEdit}
        />
        <SupplierModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          editingSupplier={editingSupplier}
          nextCode={nextCode}
        />
      </>
    );
  }

  return (
    <div className="suppliers-page">
      <div className="page-header">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2">
            <Link to="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 dark:text-white font-medium">
              Nhà cung cấp
            </span>
          </nav>
        </div>
      </div>
      <SupplierTable
        suppliers={filteredSuppliers}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onViewDetail={(supplier) => navigate(SUPPLIER_URLS.detail(supplier.id))}
      />
      <div className="pagination-container">
        <span className="pagination-info">
          Hiển thị
          <span className="font-bold text-slate-900 dark:text-white">
            1-{filteredSuppliers.length}
          </span>{" "}
          của{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {suppliers.length}
          </span>{" "}
          kết quả
>>>>>>> c9d4396b0eea2861fbc38a435f7cd5d40ab73b2a
        </span>
        <div className="pagination-controls">
          <button className="pagination-btn">
            <ChevronLeft size={18} />
          </button>
          <div className="pagination-page-list">
<<<<<<< HEAD
            <button className="pagination-page-btn pagination-page-btn-active">1</button>
=======
            <button className="pagination-page-btn pagination-page-btn-active">
              1
            </button>
>>>>>>> c9d4396b0eea2861fbc38a435f7cd5d40ab73b2a
            <button className="pagination-page-btn">2</button>
            <button className="pagination-page-btn">3</button>
          </div>
          <button className="pagination-btn">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
<<<<<<< HEAD

      {/* MODAL FORM */}
      <SupplierModal 
=======
      <SupplierModal
>>>>>>> c9d4396b0eea2861fbc38a435f7cd5d40ab73b2a
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        editingSupplier={editingSupplier}
        nextCode={nextCode}
      />
<<<<<<< HEAD

      {/* MODAL XÁC NHẬN XÓA */}
      <ConfirmModal 
=======
      <ConfirmModal
>>>>>>> c9d4396b0eea2861fbc38a435f7cd5d40ab73b2a
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa đối tác "${deletingSupplier?.supplierName}"? Toàn bộ dữ liệu liên quan sẽ không thể phục hồi.`}
        confirmLabel="Vâng, Xóa ngay"
      />
    </div>
  );
}
