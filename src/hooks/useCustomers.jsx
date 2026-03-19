import { useState } from 'react';
import { customers as mockCustomers } from '../utils/mockData';
import { toast } from '../utils/toast';

export function useCustomers() {
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
  const [deletingCustomer, setDeletingCustomer] = useState(null);

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
      toast.success('Cập nhật khách hàng thành công');
    } else {
      const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
      setCustomers(prev => [{ id: newId, ...formData }, ...prev]);
      toast.success('Thêm khách hàng mới thành công');
    }
    setIsFormOpen(false);
  };

  const handleOpenDelete = (customer) => {
    setDeletingCustomer(customer);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    setCustomers(prev => prev.filter(c => c.id !== deletingCustomer.id));
    setIsDeleteOpen(false);
    toast.success('Xóa khách hàng thành công');
  };

  const nextCode = `KH${String(customers.length + 1).padStart(3, '0')}`;

  return {
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
    nextCode
  };
}
