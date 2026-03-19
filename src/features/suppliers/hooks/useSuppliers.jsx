import { useState } from 'react';
import { suppliers as mockSuppliers } from '../../../utils/mockData';
import { toast } from '../../../utils/toast';

export function useSuppliers() {
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
      toast.success('Cập nhật nhà cung cấp thành công');
    } else {
      const newId = suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1;
      setSuppliers(prev => [{ id: newId, ...formData }, ...prev]);
      toast.success('Thêm nhà cung cấp mới thành công');
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
    toast.success('Xóa nhà cung cấp thành công');
  };

  const nextCode = `NCC${String(suppliers.length + 1).padStart(3, '0')}`;

  return {
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
  };
}
