<<<<<<< HEAD
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import suppliersService from "../api/suppliersService";
import toast from "../../../utils/toast";

const PAGE_SIZE = 7;
const normalizeSupplierPayload = (data = {}) => ({
  supplierName: String(data.supplierName || "").trim(),
  contactPerson: String(data.contactPerson || "").trim(),
  phone: String(data.phone || "").trim(),
  address: String(data.address || "").trim(),
  email: String(data.email || "").trim(),
});
=======
<<<<<<< HEAD
import { useState } from 'react';
=======
import { useState, useCallback, useMemo } from 'react';
>>>>>>> c9d4396b0eea2861fbc38a435f7cd5d40ab73b2a
import { suppliers as mockSuppliers } from '../../../utils/mockData';
import { toast } from '../../../utils/toast';
>>>>>>> 3a5566f739b6b8c84db6d85232bb921ac357dbbf

export function useSuppliers() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [suppliers, setSuppliers] = useState([]);
  const [allActiveSuppliers, setAllActiveSuppliers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstFetch, setIsFirstFetch] = useState(true);

<<<<<<< HEAD
  const initialSearch = searchParams.get("search") || "";
  const initialPage = Number(searchParams.get("page")) || 1;
=======
<<<<<<< HEAD
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
=======
  // 4. State cho tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
>>>>>>> 3a5566f739b6b8c84db6d85232bb921ac357dbbf

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  const isFirstMount = useRef(true);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (debouncedSearch) params.set("search", debouncedSearch);
    setSearchParams(params, { replace: true });
  }, [currentPage, debouncedSearch, setSearchParams]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchSuppliers = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsFetching(true);
    setLoading(true);
    try {
      const response = await suppliersService.getAll();
      if (signal.aborted) return;

      const allItems = Array.isArray(response) ? response : response?.data || [];
      const activeItems = allItems.filter((item) => item.isDeleted === false);
      setAllActiveSuppliers(activeItems);

      let filteredItems = [...activeItems];
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        filteredItems = filteredItems.filter(
          (item) =>
            item.supplierName?.toLowerCase().includes(searchLower) ||
            item.code?.toLowerCase().includes(searchLower) ||
            item.phone?.toLowerCase().includes(searchLower) ||
            item.email?.toLowerCase().includes(searchLower) ||
            item.address?.toLowerCase().includes(searchLower)
        );
      }

      const total = filteredItems.length;
      const start = (currentPage - 1) * pageSize;
      const paginatedItems = filteredItems.slice(start, start + pageSize);

<<<<<<< HEAD
      setSuppliers(paginatedItems);
      setTotalCount(total);
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("useSuppliers - Lỗi lấy dữ liệu API:", error);
      setSuppliers([]);
      setTotalCount(0);
    } finally {
      if (!signal.aborted) {
        setIsFetching(false);
        setLoading(false);
        setIsFirstFetch(false);
      }
    }
  }, [debouncedSearch, currentPage, pageSize]);
=======
  const confirmDelete = useCallback(() => {
    setSuppliers(prev => prev.filter(s => s.id !== deletingSupplier.id));
    setIsDeleteOpen(false);
    toast.success('Xóa nhà cung cấp thành công');
  }, [deletingSupplier]);
>>>>>>> c9d4396b0eea2861fbc38a435f7cd5d40ab73b2a
>>>>>>> 3a5566f739b6b8c84db6d85232bb921ac357dbbf

  useEffect(() => {
    fetchSuppliers();
    return () => abortControllerRef.current?.abort();
  }, [fetchSuppliers]);

  const handleAddSupplier = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = normalizeSupplierPayload(data);
      await suppliersService.create(payload);
      toast.success("Thêm nhà cung cấp mới thành công!");
      setIsModalOpen(false);
      fetchSuppliers();
      return true;
    } catch (error) {
      console.error("useSuppliers - handleAddSupplier error:", error);
      const serverMsg = error?.response?.data?.message || error?.response?.data?.error;
      toast.error(serverMsg || "Không thể thêm nhà cung cấp. Vui lòng thử lại.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSupplier = async (id, data) => {
    setIsSubmitting(true);
    try {
      const payload = normalizeSupplierPayload(data);
      await suppliersService.update(id, payload);
      toast.success("Cập nhật thông tin thành công!");
      setIsModalOpen(false);
      setSelectedSupplier(null);
      fetchSuppliers();
      return true;
    } catch (error) {
      console.error("useSuppliers - handleUpdateSupplier error:", error);
      const serverMsg = error?.response?.data?.message || error?.response?.data?.error;
      toast.error(serverMsg || "Lỗi khi cập nhật nhà cung cấp. Hãy kiểm tra lại dữ liệu.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!selectedSupplier) return;
    setIsSubmitting(true);
    try {
      await suppliersService.softDelete(selectedSupplier.id);
      toast.success(`Đã xóa nhà cung cấp "${selectedSupplier.supplierName}"`);
      setIsDeleteModalOpen(false);
      setSelectedSupplier(null);

      if (suppliers.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchSuppliers();
      }
      return true;
    } catch (error) {
      console.error("useSuppliers - handleDeleteSupplier error:", error);
      const serverMsg = error?.response?.data?.message || error?.response?.data?.error;
      toast.error(serverMsg || "Không thể xóa nhà cung cấp này.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const openDeleteModal = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  return {
    suppliers,
<<<<<<< HEAD
    allActiveSuppliers,
    loading,
    isFetching,
    isSubmitting,
    isFirstFetch,
    search,
    debouncedSearch,
    setSearch,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalCount,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedSupplier,
    setSelectedSupplier,
    isTrashOpen,
    setIsTrashOpen,
    handleAddSupplier,
    handleUpdateSupplier,
    handleDeleteSupplier,
    openEditModal,
    openDeleteModal,
    refreshList: fetchSuppliers,
=======
<<<<<<< HEAD
=======
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
=======
    searchSuppliers,
>>>>>>> c9d4396b0eea2861fbc38a435f7cd5d40ab73b2a
    nextCode
>>>>>>> 3a5566f739b6b8c84db6d85232bb921ac357dbbf
  };
}
