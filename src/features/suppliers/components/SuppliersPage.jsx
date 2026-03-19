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
        </span>
        <div className="pagination-controls">
          <button className="pagination-btn">
            <ChevronLeft size={18} />
          </button>
          <div className="pagination-page-list">
            <button className="pagination-page-btn pagination-page-btn-active">1</button>
            <button className="pagination-page-btn">2</button>
            <button className="pagination-page-btn">3</button>
          </div>
          <button className="pagination-btn">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* MODAL FORM */}
      <SupplierModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        editingSupplier={editingSupplier}
        nextCode={nextCode}
      />

      {/* MODAL XÁC NHẬN XÓA */}
      <ConfirmModal 
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
