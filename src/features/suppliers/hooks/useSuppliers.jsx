import { useState, useCallback, useMemo } from 'react';
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

  // 4. State cho tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');

  // --- TÌM KIẾM VÀ LỌC ---
  const filteredSuppliers = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return suppliers;
    }
    const query = searchQuery.toLowerCase();
    return suppliers.filter(s =>
      s.supplierName?.toLowerCase().includes(query) ||
      s.code?.toLowerCase().includes(query) ||
      s.email?.toLowerCase().includes(query) ||
      s.phone?.toLowerCase().includes(query) ||
      s.address?.toLowerCase().includes(query)
    );
  }, [suppliers, searchQuery]);

  const searchSuppliers = useCallback((query) => {
    setSearchQuery(query);

    /* === API CALL (uncomment when API is ready) ===
    // Gọi API tìm kiếm nhà cung cấp
    // import suppliersService from '../api/suppliersService';
    
    if (query.trim()) {
      suppliersService.search({ keyword: query })
        .then(data => {
          setSuppliers(data);
        })
        .catch(error => {
          console.error('Lỗi tìm kiếm:', error);
          toast.error('Lỗi khi tìm kiếm nhà cung cấp');
        });
    } else {
      // Nếu query rỗng, fetch toàn bộ danh sách
      suppliersService.getAll()
        .then(data => {
          setSuppliers(data);
        })
        .catch(error => {
          console.error('Lỗi lấy dữ liệu:', error);
        });
    }
    === END API CALL ===*/
  }, []);

  // --- XỬ LÝ SỰ KIỆN ---
  const handleOpenAdd = useCallback(() => {
    setEditingSupplier(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((supplier) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  }, []);

  const handleSave = useCallback((formData) => {
    setSuppliers(prev => {
      if (editingSupplier) {
        toast.success('Cập nhật nhà cung cấp thành công');
        return prev.map(s => s.id === editingSupplier.id ? { ...s, ...formData } : s);
      } else {
        const newId = prev.length > 0 ? Math.max(...prev.map(s => s.id)) + 1 : 1;
        toast.success('Thêm nhà cung cấp mới thành công');
        return [{ id: newId, ...formData }, ...prev];
      }
    });
    setIsFormOpen(false);
  }, [editingSupplier]);

  const handleOpenDelete = useCallback((supplier) => {
    setDeletingSupplier(supplier);
    setIsDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    setSuppliers(prev => prev.filter(s => s.id !== deletingSupplier.id));
    setIsDeleteOpen(false);
    toast.success('Xóa nhà cung cấp thành công');
  }, [deletingSupplier]);

  const nextCode = `NCC${String(suppliers.length + 1).padStart(3, '0')}`;

  return {
    suppliers,
    filteredSuppliers,
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
    searchSuppliers,
    nextCode
  };
}
