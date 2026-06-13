import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import productService from "../api/productsService";
import categoryService from "../../categories/api/categoriesService";
import toast from "../../../utils/toast";
import { extractApiErrorMessage } from "../../../utils/apiUtils";
import { normalizeProduct, filterProducts } from "../utils/productUtils";

const PAGE_SIZE = 10;

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

  // UI state: modal xác nhận, và drawer thùng rác
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
      let response;
      if (isTrashOpen) {
        response = await productService.getTrash();
      } else {
        response = await productService.getAll();
      }

      if (signal.aborted) return;

      let allItems = Array.isArray(response) ? response : (response.data || []);
      allItems = allItems.map(normalizeProduct);

      // Deduplicate
      const seen = new Map();
      for (const item of allItems) {
        const key = item.code || item.id;
        if (!seen.has(key)) {
          seen.set(key, item);
        } else if (item.isDefault === true) {
          seen.set(key, item);
        }
      }
      allItems = Array.from(seen.values());

      const filteredItems = filterProducts(allItems, {
        debouncedSearch,
        selectedCategoryId,
        minPrice,
        maxPrice,
      });

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
      const normalizedCategoryId = Number(data?.categoryId ?? data?.CategoryId ?? 0);
      const categoryExists = categories.some((cat) => Number(cat?.id) === normalizedCategoryId);
      if (!normalizedCategoryId || !categoryExists) {
        toast.error("Danh mục không hợp lệ hoặc đã bị xóa. Vui lòng chọn lại danh mục.");
        return null;
      }

      const productCode = String(data?.code ?? data?.Code ?? "").trim().toLowerCase();
      if (productCode) {
        const existingResponse = await productService.getAll();
        const existingItems = Array.isArray(existingResponse) ? existingResponse : (existingResponse?.data || []);
        const isDuplicateCode = existingItems.some((item) => String(item?.code ?? "").trim().toLowerCase() === productCode);
        if (isDuplicateCode) {
          toast.error("Mã sản phẩm đã tồn tại. Vui lòng nhập mã khác.");
          return null;
        }
      }

      const created = await productService.create(data);
      toast.success("Thêm sản phẩm mới thành công!");
      fetchProducts();
      return created;
    } catch (error) {
      console.error("useProducts - handleAddProduct error:", error);
      const serverMsg = extractApiErrorMessage(error, "Không thể thêm sản phẩm. Vui lòng thử lại.");
      toast.error(serverMsg || "Không thể thêm sản phẩm. Vui lòng thử lại.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (id, data) => {
    setIsSubmitting(true);
    try {
      const productCode = String(data?.code ?? data?.Code ?? "").trim().toLowerCase();
      if (productCode) {
        const existingResponse = await productService.getAll();
        const existingItems = Array.isArray(existingResponse) ? existingResponse : (existingResponse?.data || []);
        const isDuplicateCode = existingItems.some((item) => String(item?.code ?? "").trim().toLowerCase() === productCode && String(item?.id) !== String(id));
        if (isDuplicateCode) {
          toast.error("Mã sản phẩm đã tồn tại. Vui lòng nhập mã khác.");
          return null;
        }
      }

      const updated = await productService.update(id, data);
      toast.success("Cập nhật thông tin sản phẩm thành công!");
      setSelectedProduct(null);
      fetchProducts();
      return updated;
    } catch (error) {
      console.error("useProducts - handleUpdateProduct error:", error);
      const serverMsg = extractApiErrorMessage(error, "Lỗi khi cập nhật sản phẩm.");
      toast.error(serverMsg || "Lỗi khi cập nhật sản phẩm.");
      return null;
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
    filteredProducts: products,
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

    // Actions
    handleAddProduct,
    handleUpdateProduct,
    handleSoftDelete,
    handleSoftDeleteById,
    openDeleteModal,
    searchProducts,
    refreshList: fetchProducts,
  };
}
