import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { customers as mockCustomers } from '../../utils/mockData';

// Import sub-components
import CustomerTable from './CustomerTable';
import CustomerModal from './CustomerModal';

/**
 * CustomersPage - Trang chủ quản lý Khách hàng
 */
export default function CustomersPage() {
  // 1. Quản lý danh sách khách hàng
  const [customers, setCustomers] = useState(
    mockCustomers.map((c, index) => ({
      ...c,
      code: `KH${String(c.id || index + 1).padStart(3, '0')}`,
      email: `${(c.fullName || 'customer').toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
    }))
  );

  // 2. State cho Modal Form (Thêm/Sửa)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // 3. State cho Modal Xác nhận xóa
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingCustomer, setDeletingSupplier] = useState(null);

  // --- XỬ LÝ SỰ KIỆN ---
  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleSave = (formData) => {
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...formData } : c));
    } else {
      const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
      setCustomers(prev => [{ id: newId, ...formData }, ...prev]);
    }
    setIsFormOpen(false);
  };

  const handleOpenDelete = (customer) => {
    setDeletingSupplier(customer);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    setCustomers(prev => prev.filter(c => c.id !== deletingCustomer.id));
    setIsDeleteOpen(false);
  };

  const nextCode = `KH${String(customers.length + 1).padStart(3, '0')}`;

  return (
    <div className="space-y-6 animate-fadeInUp pb-12">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2">
            <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 dark:text-white font-medium">Khách hàng</span>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Quản lý Khách hàng</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý và cập nhật thông tin khách hàng của bạn</p>
        </div>
        <Button onClick={handleOpenAdd} icon={<Plus size={18} />} className="shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
          Thêm khách hàng
        </Button>
      </div>

      {/* ===== TABLE CONTENT ===== */}
      <CustomerTable 
        customers={customers} 
        onEdit={handleOpenEdit} 
        onDelete={handleOpenDelete} 
      />

      {/* ===== PAGINATION ===== */}
      <div className="px-8 py-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Hiển thị <span className="font-bold text-slate-900 dark:text-white">1-{customers.length}</span> của <span className="font-bold text-slate-900 dark:text-white">24</span> kết quả
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
      <CustomerModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        editingCustomer={editingCustomer}
        nextCode={nextCode}
      />

      {/* ===== MODAL XÁC NHẬN XÓA ===== */}
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
