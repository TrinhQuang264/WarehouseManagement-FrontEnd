import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import productService from "../api/productsService";
import categoryService from "../../categories/api/categoriesService";
import toast from "../../../utils/toast";

const PAGE_SIZE = 10;
const normalizeProduct = (item = {}) => {
  const normalizedPrice = item.price ?? item.sellingPrice ?? 0;

  return {
    ...item,
    price: normalizedPrice,
    sellingPrice: normalizedPrice,
  };
};

export function useProducts(defaultPageSize = PAGE_SIZE) {
  // URL query params for sync search/page/filter with browser URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Data nguồn hiển thị cho trang sản phẩm
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Loading/submitting states for fetch/list actions and submit actions
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial values lấy từ URL để giữ trạng thái khi reload/share link
  const initialSearch = searchParams.get("search") || "";
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialCategoryId = searchParams.get("categoryId") || "";
  const initialPageSize = Number(searchParams.get("pageSize")) || defaultPageSize;

  // Search + pagination state
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);

  // Filter state
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // UI state: chọn hàng, modal xác nhận, và drawer thùng rác
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  // Internal refs: skip debounce lần mount đầu + hủy request cũ khi fetch mới
  const isFirstMount = useRef(true);
  const abortControllerRef = useRef(null);

  // Sync state with URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCategoryId) params.set("categoryId", selectedCategoryId);
    if (pageSize !== defaultPageSize) params.set("pageSize", pageSize);
    setSearchParams(params, { replace: true });
  }, [currentPage, debouncedSearch, selectedCategoryId, pageSize, defaultPageSize, setSearchParams]);

  // Debounce search
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

  // Fetch categories for the form dropdown
  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryService.getAll();
      const activeItems = Array.isArray(data) 
        ? data.filter(c => c.isDeleted === false)
        : (data.data || []).filter(c => c.isDeleted === false);
      setCategories(activeItems);
    } catch (error) {
      console.error("useProducts - fetchCategories error:", error);
    }
  }, []);

  // Main fetch products logic
  const fetchProducts = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setLoading(true);
    try {
      // Use getAll to handle flexible client-side filtering as requested by the user's structure
      // or alternate between getAll and getTrash based on isTrashOpen
      let response;
      if (isTrashOpen) {
        response = await productService.getTrash();
      } else {
        response = await productService.getAll();
      }

      if (signal.aborted) return;

      let allItems = Array.isArray(response) ? response : (response.data || []);
      allItems = allItems.map(normalizeProduct);

      // Deduplicate: API trả về flat list tất cả variants.
      // Chỉ giữ lại variant mặc định (isDefault: true) để hiển thị bảng danh sách.
      // Nếu không có variant nào isDefault, fallback lấy cái đầu tiên của mỗi mã.
      const seen = new Map();
      for (const item of allItems) {
        const key = item.code || item.id;
        if (!seen.has(key)) {
          seen.set(key, item);
        } else if (item.isDefault === true) {
          // Ưu tiên variant isDefault
          seen.set(key, item);
        }
      }
      allItems = Array.from(seen.values());

      // Rule: isActive determines visibility in main list vs trash if not already split by API
      // However, since we have a dedicated /trash endpoint, we'll trust the API response but 
      // can still double-check isActive if needed.
      // Client-side Filtering
      let filteredItems = [...allItems];


      // 1. Search (Name/Code/Description)
      if (debouncedSearch) {
        const lowerSearch = debouncedSearch.toLowerCase();
        filteredItems = filteredItems.filter(item => 
          item.name?.toLowerCase().includes(lowerSearch) ||
          item.code?.toLowerCase().includes(lowerSearch) ||
          item.description?.toLowerCase().includes(lowerSearch)
        );
      }

      // 2. Category Filter
      if (selectedCategoryId) {
        filteredItems = filteredItems.filter(item => 
          item.categoryId === Number(selectedCategoryId)
        );
      }

      // 3. Price Filter (Selling Price)
      if (minPrice !== "") {
        filteredItems = filteredItems.filter(item => item.price >= Number(minPrice));
      }
      if (maxPrice !== "") {
        filteredItems = filteredItems.filter(item => item.price <= Number(maxPrice));
      }

      const total = filteredItems.length;

      // 4. Client-side Pagination
      const start = (currentPage - 1) * pageSize;
      const paginatedItems = filteredItems.slice(start, start + pageSize);

      setProducts(paginatedItems);
      setTotalCount(total);
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("useProducts - fetchProducts error:", error);
      setProducts([]);
      setTotalCount(0);
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [debouncedSearch, currentPage, pageSize, isTrashOpen, selectedCategoryId, minPrice, maxPrice]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
    return () => abortControllerRef.current?.abort();
  }, [fetchProducts]);

  // --- Handlers ---

  const handleAddProduct = async (data) => {
    setIsSubmitting(true);
    try {
      await productService.create(data);
      toast.success("Thêm sản phẩm mới thành công!");
      fetchProducts();
      return true;
    } catch (error) {
      console.error("useProducts - handleAddProduct error:", error);
      const serverMsg = error?.response?.data?.message || error?.response?.data?.error;
      toast.error(serverMsg || "Không thể thêm sản phẩm. Vui lòng thử lại.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (id, data) => {
    setIsSubmitting(true);
    try {
      // Assuming a generic update or specifically updateStatus if that's what's available
      // If backend doesn't have a generic PUT /Products/{id}, we might need to adjust.
      // For now, mapping to updateStatus or create if it handles both (generic pattern)
      await productService.update(id, data);
      toast.success("Cập nhật thông tin sản phẩm thành công!");
      setSelectedProduct(null);
      fetchProducts();
      return true;
    } catch (error) {
      console.error("useProducts - handleUpdateProduct error:", error);
      const serverMsg = error?.response?.data?.message || error?.response?.data?.error;
      toast.error(serverMsg || "Lỗi khi cập nhật sản phẩm.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSoftDeleteById = async (id) => {
    setIsSubmitting(true);
    try {
      await productService.softDelete(id);
      toast.success("Đã chuyển sản phẩm vào thùng rác");
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(p => p - 1);
      } else {
        fetchProducts();
      }
    } catch (error) {
      console.error("useProducts - handleSoftDelete error:", error);
      toast.error("Không thể xóa sản phẩm này.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!selectedProduct) return;
    await handleSoftDeleteById(selectedProduct.id);
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  // --- Bulk Actions ---

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  const handleBulkSoftDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsSubmitting(true);
    try {
      await productService.bulkSoftDelete(selectedIds);
      toast.success(`Đã chuyển ${selectedIds.length} sản phẩm vào thùng rác`);
      setSelectedIds([]);
      fetchProducts();
    } catch (error) {
      toast.error("Lỗi khi xóa hàng loạt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSelection = () => setSelectedIds([]);

  const resetFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategoryId("");
    setCurrentPage(1);
  };

  const searchProducts = useCallback((value) => {
    setSearch(value);
  }, []);

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  return {
    products,
    filteredProducts: products, // Alias for compatibility
    categories,
    loading,
    isSubmitting,

    search,
    setSearch,
    debouncedSearch,
    currentPage,
    setCurrentPage,
    pageSize,
    totalCount,

    // Filters
    selectedCategoryId,
    setSelectedCategoryId,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    resetFilters,

    // Modals & Selection
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedProduct,
    isTrashOpen,
    setIsTrashOpen,
    selectedIds,

    // Actions
    handleAddProduct,
    handleUpdateProduct,
    handleSoftDelete,
    handleSoftDeleteById,
    handleBulkSoftDelete,
    openDeleteModal,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    searchProducts,
    refreshList: fetchProducts,
  };
}
