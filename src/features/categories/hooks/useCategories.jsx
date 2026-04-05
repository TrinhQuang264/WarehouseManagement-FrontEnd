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

  // States quản lý chọn hàng loạt (Bulk Selection)
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [allActiveCategories, setAllActiveCategories] = useState([]);
  
  const isFirstMount = useRef(true);
  
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (debouncedSearch) params.set("search", debouncedSearch);
    
    // Convert object params thành string, vì có thể params rỗng thì URL = /categories
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

  const checkNameExists = async (name) => {
    try {
      const checkResult = await categoryService.checkName(name);
      return typeof checkResult === "object" 
        ? (checkResult.isExist || checkResult.data?.isExist || checkResult.exists) 
        : checkResult === true;
    } catch (error) {
      console.error("[useCategories] Lỗi kiểm tra tên:", error);
      return false;
    }
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAll();
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

      //Phân trang 
      const start = (currentPage - 1) * pageSize;
      const paginatedItems = filteredItems.slice(start, start + pageSize);

      setCategories(paginatedItems);
      setTotalCount(total);
    } catch (error) {
      console.error("useCategories - Lỗi lấy dữ liệu API:", error);
      setCategories([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
      setIsFirstFetch(false);
      setSelectedIds([]);
    }
  }, [debouncedSearch, currentPage, pageSize]);

  // Tự động fetch lại khi phân trang hoặc search thay đổi
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Thêm mới Danh mục
  const handleAddCategory = async (data) => {
    setLoading(true);
    try {
      if (await checkNameExists(data.name)) {
        toast.error("Tên danh mục đã tồn tại!");
        return false;
      }

      await categoryService.create(data);
      toast.success("Thêm danh mục mới thành công!");
      setIsModalOpen(false);
      fetchCategories();
      return true;
    } catch (error) {
      console.error("useCategories - handleAddCategory error:", error);
      toast.error("Không thể thêm danh mục. Vui lòng thử lại.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Cập nhật Danh mục
  const handleUpdateCategory = async (id, data) => {
    setLoading(true);
    try {
      if (selectedCategory && selectedCategory.name !== data.name) {
        if (await checkNameExists(data.name)) {
          toast.error("Tên danh mục đã tồn tại!");
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
      console.error("useCategories - handleUpdateCategory error:", error);
      toast.error("Lỗi khi cập nhật danh mục. Hãy kiểm tra lại dữ liệu.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Xóa mềm (Soft Delete)
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
      console.error("useCategories - handleDeleteCategory error:", error);
      toast.error("Không thể xóa danh mục này.");
    } finally {
      setLoading(false);
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
    
    setLoading(true);
    try {
      await categoryService.bulkSoftDelete(selectedIds);
      toast.success(`Đã xóa ${selectedIds.length} danh mục vào thùng rác`);
      setSelectedIds([]);
      fetchCategories();
    } catch (error) {
      console.error("useCategories - handleBulkSoftDelete error:", error);
      toast.error("Không thể xóa các danh mục đã chọn.");
    } finally {
      setLoading(false);
    }
  };

  return {
    // Dữ liệu & Loading
    categories,
    allActiveCategories,
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