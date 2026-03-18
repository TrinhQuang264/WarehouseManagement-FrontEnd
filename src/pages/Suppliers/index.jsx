import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { suppliers as mockSuppliers } from '../../utils/mockData';

// Import sub-components
import SupplierTable from './SupplierTable';
import SupplierModal from './SupplierModal';

/**
 * SuppliersPage - Trang chủ quản lý Nhà cung cấp
 */
export default function SuppliersPage() {
  // 1. Quản lý danh sách nhà cung cấp
  const [suppliers, setSuppliers] = useState(
    mockSuppliers.map((s, index) => ({
      ...s,
      code: `NCC00${s.id || index + 1}`,
      email: `${(s.supplierName || 'supplier').toLowerCase().replace(/\s+/g, '-')}@business.vn`,
      phone: '0901 234 567',
    }))
  );

  // 2. State cho Modal Form (Thêm/Sửa)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // 3. State cho Modal Xác nhận xóa
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingSupplier, setDeletingSupplier] = useState(null);

  // --- XỬ LÝ SỰ KIỆN ---
  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (supplier) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleSave = (formData) => {
    if (editingSupplier) {
      setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? { ...s, ...formData } : s));
    } else {
      const newId = suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1;
      setSuppliers(prev => [{ id: newId, ...formData }, ...prev]);
    }
    setIsFormOpen(false);
  };

  const handleOpenDelete = (supplier) => {
    setDeletingSupplier(supplier);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    setSuppliers(prev => prev.filter(s => s.id !== deletingSupplier.id));
    setIsDeleteOpen(false);
  };

  const nextCode = `NCC${String(suppliers.length + 1).padStart(3, '0')}`;

  return (
    <div className="space-y-6 animate-fadeInUp pb-12">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2">
            <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 dark:text-white font-medium">Nhà cung cấp</span>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Danh sách Nhà cung cấp</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý và cập nhật thông tin các đối tác cung ứng của bạn</p>
        </div>
        <Button onClick={handleOpenAdd} icon={<Plus size={18} />} className="shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
          Thêm nhà cung cấp
        </Button>
      </div>

      {/* ===== TABLE CONTENT ===== */}
      <SupplierTable 
        suppliers={suppliers} 
        onEdit={handleOpenEdit} 
        onDelete={handleOpenDelete} 
      />

      {/* ===== PAGINATION ===== */}
      <div className="px-8 py-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Hiển thị <span className="font-bold text-slate-900 dark:text-white">1-{suppliers.length}</span> của <span className="font-bold text-slate-900 dark:text-white">48</span> kết quả
        </span>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-all disabled:opacity-50">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            <button className="w-9 h-9 rounded-xl font-bold text-sm bg-primary text-white shadow-lg shadow-primary/20">1</button>
            <button className="w-9 h-9 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-all">2</button>
            <button className="w-9 h-9 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-all">3</button>
          </div>
          <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ===== MODAL FORM ===== */}
      <SupplierModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        editingSupplier={editingSupplier}
        nextCode={nextCode}
      />

      {/* ===== MODAL XÁC NHẬN XÓA ===== */}
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
