import { useState, useCallback, useMemo, useEffect } from "react";
import customersService from "../api/customersService";
import { toast } from "../../../utils/toast";

export function useCustomers() {
  // State
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all customers on mount
  useEffect(() => {
    customersService
      .getAll()
      .then(data => {
        setCustomers(data);
        setError(null);
      })
      .catch(err => {
        console.error("Error fetching customers:", err);
        setError(err);
        toast.error("Failed to load customers");
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtered customers based on search query
  const filteredCustomers = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter(c =>
      c.fullName?.toLowerCase().includes(query) ||
      c.code?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.phoneNumber?.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(startIdx, startIdx + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  const searchCustomers = useCallback(query => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (query && query.trim()) {
      customersService
        .search({ keyword: query })
        .then(data => setCustomers(data))
        .catch(err => {
          console.error("Search error:", err);
          toast.error("Search failed");
        });
    } else {
      customersService
        .getAll()
        .then(data => setCustomers(data))
        .catch(err => console.error(err));
    }
  }, []);

  // CRUD operations
  const handleOpenAdd = useCallback(() => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback(customer => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  }, []);

  const handleSave = useCallback(async formData => {
    if (editingCustomer) {
      try {
        const updated = await customersService.update(editingCustomer.id, formData);
        setCustomers(prev => prev.map(c => (c.id === editingCustomer.id ? updated : c)));
        toast.success("Cập nhật khách hàng thành công");
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi cập nhật khách hàng");
      }
    } else {
      try {
        const newCode = `KH${String(customers.length + 1).padStart(3, "0")}`;
        const created = await customersService.create({ ...formData, code: newCode });
        setCustomers(prev => [created, ...prev]);
        toast.success("Thêm khách hàng mới thành công");
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tạo khách hàng");
      }
    }
    setIsFormOpen(false);
  }, [editingCustomer, customers.length]);

  const handleOpenDelete = useCallback(customer => {
    setDeletingCustomer(customer);
    setIsDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deletingCustomer) return;
    try {
      await customersService.delete(deletingCustomer.id);
      setCustomers(prev => prev.filter(c => c.id !== deletingCustomer.id));
      toast.success("Xóa khách hàng thành công");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa khách hàng");
    }
    setIsDeleteOpen(false);
  }, [deletingCustomer]);

  const nextCode = `KH${String(customers.length + 1).padStart(3, "0")}`;

  return {
    customers,
    filteredCustomers,
    paginatedCustomers,
    loading,
    error,
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
    // pagination
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize,
  };
}
