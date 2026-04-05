import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import categoryService from "../api/categoriesService";
import toast from "../../../utils/toast";

const PAGE_SIZE = 7;

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (debouncedSearch) params.set("search", debouncedSearch);
    
    // Convert object params thành string, vì có thể params rỗng thì URL = /categories
    setSearchParams(params, { replace: true });
  }, [currentPage, debouncedSearch, setSearchParams]);

  // --- States quản lý UI (Modal) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    // Debounce 500ms để tránh gọi API liên tục khi user đang gõ phím nhanh
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /**
   * 2. Parse response từ API — hỗ trợ nhiều cấu trúc trả về khác nhau
   * Trả về { items, total, isServerPaginated }
   */
  const parseResponse = (response) => {
    if (!response) return { items: [], total: 0, isServerPaginated: false };

    // Cấu trúc: { items, totalRecords } — cấu trúc API hiện tại
    if (response.items) {
      return {
        items: response.items,
        total: response.totalRecords ?? response.totalCount ?? response.items.length,
        isServerPaginated: true,
      };
    }

    // Cấu trúc: { results, totalRecords }
    if (response.results) {
      return {
        items: response.results,
        total: response.totalRecords ?? response.totalCount ?? response.results.length,
        isServerPaginated: true,
      };
    }

    // Cấu trúc: { data: { items, totalRecords } } — axios bọc thêm 1 lớp data
    if (response.data?.items) {
      return {
        items: response.data.items,
        total: response.data.totalRecords ?? response.data.totalCount ?? response.data.items.length,
        isServerPaginated: true,
      };
    }

    // Cấu trúc: { data: [...] }
    if (Array.isArray(response.data)) {
      return {
        items: response.data,
        total: response.totalRecords ?? response.totalCount ?? response.data.length,
        isServerPaginated: !!(response.totalRecords ?? response.totalCount),
      };
    }

    // Cấu trúc: [...] — API trả về mảng thẳng, phân trang client-side
    if (Array.isArray(response)) {
      return {
        items: response,
        total: response.length,
        isServerPaginated: false,
      };
    }

    return { items: [], total: 0, isServerPaginated: false };
  };

  /**
   * 3. Lấy dữ liệu danh mục từ API
   */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoryService.filter({
        filter: debouncedSearch,
        pageIndex: currentPage,
        pageSize: pageSize,
      });

      let { items, total, isServerPaginated } = parseResponse(response);

      // Nếu API trả về toàn bộ dữ liệu (không phân trang server-side),
      // tính total trước rồi mới slice để phân trang client-side
      if (!isServerPaginated && items.length > 0) {
        total = items.length; // tổng thực sự
        const start = (currentPage - 1) * pageSize;
        items = items.slice(start, start + pageSize);
      }

      setCategories(items);
      setTotalCount(total);
    } catch (error) {
      console.error("[useCategories] Lỗi lấy dữ liệu API:", error);
      setCategories([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
      setIsFirstFetch(false);
    }
  }, [debouncedSearch, currentPage, pageSize]);

  // Tự động fetch lại khi phân trang hoặc search thay đổi
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /**
   * 4. Xử lý Thêm mới Danh mục
   */
  const handleAddCategory = async (data) => {
    setLoading(true);
    try {
      const checkResult = await categoryService.checkName(data.name);
      const isExist = typeof checkResult === "object" ? checkResult.isExist || checkResult.data?.isExist || checkResult.exists : checkResult === true;
      if (isExist) {
        toast.error("Tên danh mục đã tồn tại!");
        setLoading(false);
        return false;
      }

      await categoryService.create(data);
      toast.success("Thêm danh mục mới thành công!");
      setIsModalOpen(false);
      fetchCategories();
      return true;
    } catch (error) {
      console.error("[useCategories] handleAddCategory error:", error);
      toast.error("Không thể thêm danh mục. Vui lòng thử lại.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 5. Xử lý Cập nhật Danh mục
   */
  const handleUpdateCategory = async (id, data) => {
    setLoading(true);
    try {
      if (selectedCategory && selectedCategory.name !== data.name) {
        const checkResult = await categoryService.checkName(data.name);
        const isExist = typeof checkResult === "object" ? checkResult.isExist || checkResult.data?.isExist || checkResult.exists : checkResult === true;
        if (isExist) {
          toast.error("Tên danh mục đã tồn tại!");
          setLoading(false);
          return false;
        }
      }

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
      console.error("[useCategories] handleUpdateCategory error:", error);
      toast.error("Lỗi khi cập nhật danh mục. Hãy kiểm tra lại dữ liệu.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 6. Xử lý Xóa mềm (Soft Delete)
   */
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setLoading(true);
    try {
      await categoryService.softDelete(selectedCategory.id);
      toast.success(`Đã xóa danh mục "${selectedCategory.name}"`);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("[useCategories] handleDeleteCategory error:", error);
      toast.error("Không thể xóa danh mục này.");
    } finally {
      setLoading(false);
    }
  };

  // --- Mở Modal để Sửa ---
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // --- Mở Modal để Xóa ---
  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  return {
    // Dữ liệu & Loading
    categories,
    loading,
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

    // Actions
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    openEditModal,
    openDeleteModal,
    refreshList: fetchCategories,
  };
}