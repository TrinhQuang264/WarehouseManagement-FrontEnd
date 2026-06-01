<<<<<<< HEAD
import { useState, useCallback, useMemo } from "react";
import { customers as mockCustomers } from "../../../utils/mockData";
import { toast } from "../../../utils/toast";
=======
import { useState } from 'react';
import { customers as mockCustomers } from '../../../utils/mockData';
import { toast } from '../../../utils/toast';
>>>>>>> 3a5566f739b6b8c84db6d85232bb921ac357dbbf

export function useCustomers() {
  // 1. Quản lý danh sách khách hàng
  const [customers, setCustomers] = useState(
    mockCustomers.map((c, index) => ({
      ...c,
      code: `KH${String(c.id || index + 1).padStart(3, "0")}`,
      email: `${(c.fullName || "customer").toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
    })),
  );

  // 2. State cho Modal Form (Thêm/Sửa)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // 3. State cho Modal Xác nhận xóa
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(null);

<<<<<<< HEAD
  // 4. State cho tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");

  // --- TÌM KIẾM VÀ LỌC ---
  const filteredCustomers = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return customers;
    }
    const query = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.fullName?.toLowerCase().includes(query) ||
        c.code?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.phone?.toLowerCase().includes(query),
    );
  }, [customers, searchQuery]);

  const searchCustomers = useCallback((query) => {
    setSearchQuery(query);

    /* === API CALL (uncomment when API is ready) ===
    // Gọi API tìm kiếm khách hàng
    // import customersService from '../api/customersService';
    
    if (query.trim()) {
      customersService.search({ keyword: query })
        .then(data => {
          setCustomers(data);
        })
        .catch(error => {
          console.error('Lỗi tìm kiếm:', error);
          toast.error('Lỗi khi tìm kiếm khách hàng');
        });
    } else {
      // Nếu query rỗng, fetch toàn bộ danh sách
      customersService.getAll()
        .then(data => {
          setCustomers(data);
        })
        .catch(error => {
          console.error('Lỗi lấy dữ liệu:', error);
        });
    }
    === END API CALL ===*/
  }, []);

=======
>>>>>>> 3a5566f739b6b8c84db6d85232bb921ac357dbbf
  // --- XỬ LÝ SỰ KIỆN ---
  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

<<<<<<< HEAD
  const handleSave = useCallback(
    (formData) => {
      setCustomers((prev) => {
        if (editingCustomer) {
          toast.success("Cập nhật khách hàng thành công");
          return prev.map((c) =>
            c.id === editingCustomer.id ? { ...c, ...formData } : c,
          );
        } else {
          const newId =
            prev.length > 0 ? Math.max(...prev.map((c) => c.id)) + 1 : 1;
          toast.success("Thêm khách hàng mới thành công");
          return [{ id: newId, ...formData }, ...prev];
        }
      });
      setIsFormOpen(false);
    },
    [editingCustomer],
  );
=======
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
>>>>>>> 3a5566f739b6b8c84db6d85232bb921ac357dbbf

  const handleOpenDelete = (customer) => {
    setDeletingCustomer(customer);
    setIsDeleteOpen(true);
  };

<<<<<<< HEAD
  const confirmDelete = useCallback(() => {
    setCustomers((prev) => prev.filter((c) => c.id !== deletingCustomer.id));
    setIsDeleteOpen(false);
    toast.success("Xóa khách hàng thành công");
  }, [deletingCustomer]);
=======
  const confirmDelete = () => {
    setCustomers(prev => prev.filter(c => c.id !== deletingCustomer.id));
    setIsDeleteOpen(false);
    toast.success('Xóa khách hàng thành công');
  };
>>>>>>> 3a5566f739b6b8c84db6d85232bb921ac357dbbf

  const nextCode = `KH${String(customers.length + 1).padStart(3, "0")}`;

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
<<<<<<< HEAD
    searchCustomers,
    nextCode,
=======
    nextCode
>>>>>>> 3a5566f739b6b8c84db6d85232bb921ac357dbbf
  };
}
