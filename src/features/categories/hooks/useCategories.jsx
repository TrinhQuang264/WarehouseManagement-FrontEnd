import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import categoryService from "../api/categoriesService";
import toast from "../../../utils/toast";

const PAGE_SIZE = 7;

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);

  // States quản lý chọn hàng loạt (Bulk Selection)
  const [selectedIds, setSelectedIds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [allActiveCategories, setAllActiveCategories] = useState([]);

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

  const fetchCategories = useCallback(async () => {
    // Hủy request cũ nếu đang chạy (tránh race condition)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsFetching(true);
    setLoading(true);
    try {
      const response = await categoryService.getAll();
      if (signal.aborted) return;

      let allItems = Array.isArray(response) ? response : (response.data || []);

      const activeItems = allItems.filter(item =>
        item.isDeleted === false
      );

      setAllActiveCategories(activeItems);
      let filteredItems = [...activeItems];
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        filteredItems = filteredItems.filter(item =>
          item.name?.toLowerCase().includes(searchLower) ||
          item.seoDescription?.toLowerCase().includes(searchLower)
        );
      }

      const total = filteredItems.length;

      // Phân trang
      const start = (currentPage - 1) * pageSize;
      const paginatedItems = filteredItems.slice(start, start + pageSize);

      setCategories(paginatedItems);
      setTotalCount(total);
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("useCategories - Lỗi lấy dữ liệu API:", error);
      setCategories([]);
      setTotalCount(0);
    } finally {
      if (!signal.aborted) {
        setIsFetching(false);
        setLoading(false);
        setIsFirstFetch(false);
      }
    }
  }, [debouncedSearch, currentPage, pageSize]);

  useEffect(() => {
    fetchCategories();
    return () => abortControllerRef.current?.abort();
  }, [fetchCategories]);

  // Thêm mới Danh mục
  const handleAddCategory = async (data) => {
    setIsSubmitting(true);
    try {
      await categoryService.create(data);
      toast.success("Thêm danh mục mới thành công!");
      setIsModalOpen(false);
      fetchCategories();
      return true;
    } catch (error) {
      console.error("useCategories - handleAddCategory error:", error);
      const serverMsg = error?.response?.data?.message || error?.response?.data?.error;
      toast.error(serverMsg || "Không thể thêm danh mục. Vui lòng thử lại.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý Cập nhật Danh mục
  const handleUpdateCategory = async (id, data) => {
    setIsSubmitting(true);
    try {
      const updateData = {
        name: data.name,
        seoAlias: data.seoAlias || "",
        seoDescription: data.seoDescription || "",
        sortOrder: Number(data.sortOrder) || 0,
        parentId: Number(data.parentId) || 0,
      };

      await categoryService.update(id, updateData);
      toast.success("Cập nhật thông tin thành công!");
      setIsModalOpen(false);
      setSelectedCategory(null);
      fetchCategories();
      return true;
    } catch (error) {
      console.error("useCategories - handleUpdateCategory error:", error);
      const serverMsg = error?.response?.data?.message || error?.response?.data?.error;
      toast.error(serverMsg || "Lỗi khi cập nhật danh mục. Hãy kiểm tra lại dữ liệu.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý Xóa mềm (Soft Delete)
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);
    try {
      await categoryService.softDelete(selectedCategory.id);
      toast.success(`Đã xóa danh mục "${selectedCategory.name}"`);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      // Auto lùi trang nếu xóa hết item trên trang hiện tại
      if (categories.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchCategories();
      }
    } catch (error) {
      console.error("useCategories - handleDeleteCategory error:", error);
      const serverMsg = error?.response?.data?.message || error?.response?.data?.error;
      toast.error(serverMsg || "Không thể xóa danh mục này.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mở Modal để Sửa
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // Mở Modal để Xóa
  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Logic Chọn Checkbox
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === categories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map((c) => c.id));
    }
  };

  // Hành động hàng loạt
  const handleBulkSoftDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsSubmitting(true);
    try {
      await categoryService.bulkSoftDelete(selectedIds);
      toast.success(`Đã xóa ${selectedIds.length} danh mục vào thùng rác`);
      setSelectedIds([]);
      // Auto lùi trang nếu xóa hết item trên trang hiện tại
      if (selectedIds.length === categories.length && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchCategories();
      }
    } catch (error) {
      console.error("useCategories - handleBulkSoftDelete error:", error);
      const serverMsg = error?.response?.data?.message || error?.response?.data?.error;
      toast.error(serverMsg || "Không thể xóa các danh mục đã chọn.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Dữ liệu & Loading
    categories,
    allActiveCategories,
    loading,        // giữ để không breaking change component cũ
    isFetching,     // spinner bảng
    isSubmitting,   // spinner nút submit modal
    isFirstFetch,

    // Tìm kiếm & Phân trang
    search,
    debouncedSearch,
    setSearch,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalCount,

    // Modal state
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedCategory,
    setSelectedCategory,
    isTrashOpen,
    setIsTrashOpen,

    // Actions
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleBulkSoftDelete,
    openEditModal,
    openDeleteModal,
    toggleSelect,
    toggleSelectAll,
    selectedIds,
    refreshList: fetchCategories,
  };
}