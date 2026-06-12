import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import customersService from "../api/customersService";
import toast from "../../../utils/toast";

const PAGE_SIZE = 7;

const normalizeCustomerPayload = (data = {}) => ({
  fullName: String(data.fullName || "").trim(),
  phoneNumber: String(data.phoneNumber || "").trim(),
  address: String(data.address || "").trim(),
  email: String(data.email || "").trim(),
});

export function useCustomers() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [customers, setCustomers] = useState([]);
  const [allActiveCustomers, setAllActiveCustomers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstFetch, setIsFirstFetch] = useState(true);

  const initialSearch = searchParams.get("search") || "";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  const isFirstMount = useRef(true);
  const abortControllerRef = useRef(null);

  // Đồng bộ state lên URL Search Params
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (debouncedSearch) params.set("search", debouncedSearch);
    setSearchParams(params, { replace: true });
  }, [currentPage, debouncedSearch, setSearchParams]);

  // Debounce chuỗi tìm kiếm đầu vào (delay 300ms)
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

  // Hàm fetch dữ liệu cốt lõi kết hợp Client-side filter & phân trang
  const fetchCustomers = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsFetching(true);
    setLoading(true);
    try {
      const response = await customersService.getAll();
      if (signal.aborted) return;

      const allItems = Array.isArray(response)
        ? response
        : response?.data || response?.items || [];

      const activeItems = allItems.filter((item) => item.isDeleted !== true);
      setAllActiveCustomers(activeItems);

      let filteredItems = [...activeItems];
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        filteredItems = filteredItems.filter(
          (c) =>
            c.fullName?.toLowerCase().includes(query) ||
            c.code?.toLowerCase().includes(query) ||
            c.email?.toLowerCase().includes(query) ||
            c.phoneNumber?.toLowerCase().includes(query),
        );
      }

      const total = filteredItems.length;
      const start = (currentPage - 1) * pageSize;
      const paginatedItems = filteredItems.slice(start, start + pageSize);

      setCustomers(paginatedItems);
      setTotalCount(total);
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("useCustomers - Lỗi lấy dữ liệu API:", error);
      setCustomers([]);
      setTotalCount(0);
      toast.error("Không thể tải danh sách khách hàng");
    } finally {
      if (!signal.aborted) {
        setIsFetching(false);
        setLoading(false);
        setIsFirstFetch(false);
      }
    }
  }, [debouncedSearch, currentPage, pageSize]);

  // Kích hoạt fetch khi dependencies thay đổi
  useEffect(() => {
    fetchCustomers();
    return () => abortControllerRef.current?.abort();
  }, [fetchCustomers]);

  // Logic tính toán sinh mã tự động tiếp theo dựa trên tổng số lượng hiện tại
  const nextCode = useMemo(() => {
    return `KH${String(allActiveCustomers.length + 1).padStart(3, "0")}`;
  }, [allActiveCustomers.length]);

  // Add khách hàng
  const handleAddCustomer = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...normalizeCustomerPayload(data),
        code: nextCode,
      };
      await customersService.create(payload);
      toast.success("Thêm khách hàng mới thành công!");
      setIsModalOpen(false);
      fetchCustomers();
      return true;
    } catch (error) {
      console.error("useCustomers - handleAddCustomer error:", error);
      const serverMsg =
        error?.response?.data?.Message ||
        error?.response?.data?.message ||
        error?.response?.data?.error;
      toast.error(serverMsg || "Không thể thêm khách hàng. Vui lòng thử lại.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update khách hàng
  const handleUpdateCustomer = async (id, data) => {
    setIsSubmitting(true);
    try {
      const payload = normalizeCustomerPayload(data);
      await customersService.update(id, payload);
      toast.success("Cập nhật thông tin khách hàng thành công!");
      setIsModalOpen(false);
      setSelectedCustomer(null);
      fetchCustomers();
      return true;
    } catch (error) {
      console.error("useCustomers - handleUpdateCustomer error:", error);
      const serverMsg =
        error?.response?.data?.Message ||
        error?.response?.data?.message ||
        error?.response?.data?.error;
      toast.error(
        serverMsg || "Lỗi khi cập nhật khách hàng. Hãy kiểm tra lại dữ liệu.",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete khách hàng
  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    setIsSubmitting(true);
    try {
      await customersService.softDelete(selectedCustomer.id);
      toast.success(`Đã xóa khách hàng "${selectedCustomer.fullName}"`);
      setIsDeleteModalOpen(false);
      setSelectedCustomer(null);

      if (customers.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchCustomers();
      }
      return true;
    } catch (error) {
      console.error("useCustomers - handleDeleteCustomer error:", error);
      const serverMsg =
        error?.response?.data?.Message ||
        error?.response?.data?.message ||
        error?.response?.data?.error;
      toast.error(serverMsg || "Không thể xóa khách hàng này.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return {
    customers,
    allActiveCustomers,
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
    totalPages,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedCustomer,
    setSelectedCustomer,
    isTrashOpen,
    setIsTrashOpen,
    handleAddCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer,
    openEditModal,
    openDeleteModal,
    nextCode,
    refreshList: fetchCustomers,
  };
}
