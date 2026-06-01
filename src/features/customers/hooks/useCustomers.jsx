import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import customersService from "../api/customersService";
import toast from "../../../utils/toast";

const PAGE_SIZE = 7;

// Hàm chuẩn hóa dữ liệu đầu vào cho Customer giống như Supplier
const normalizeCustomerPayload = (data = {}) => ({
  fullName: String(data.fullName || "").trim(),
  phoneNumber: String(data.phoneNumber || "").trim(),
  address: String(data.address || "").trim(),
  email: String(data.email || "").trim(),
});

export function useCustomers() {
  const [searchParams, setSearchParams] = useSearchParams();

  // States danh sách tương tự useSuppliers
  const [customers, setCustomers] = useState([]);
  const [allActiveCustomers, setAllActiveCustomers] = useState([]);

  // States quản lý trạng thái loading / submit
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstFetch, setIsFirstFetch] = useState(true);

  // Đồng bộ hóa việc đọc dữ liệu ban đầu từ URL params
  const initialSearch = searchParams.get("search") || "";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);

  // States điều khiển các Modals đóng/mở công khai
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  const isFirstMount = useRef(true);
  const abortControllerRef = useRef(null);

  // 1. Đồng bộ state lên URL Search Params
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (debouncedSearch) params.set("search", debouncedSearch);
    setSearchParams(params, { replace: true });
  }, [currentPage, debouncedSearch, setSearchParams]);

  // 2. Debounce chuỗi tìm kiếm đầu vào (delay 300ms)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset về trang 1 khi tìm kiếm thay đổi
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // 3. Hàm fetch dữ liệu cốt lõi kết hợp Client-side filter & phân trang
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

      // Chuẩn hóa cấu trúc mảng trả về từ API
      const allItems = Array.isArray(response)
        ? response
        : response?.data || response?.items || [];

      // Lọc các item chưa bị xóa mềm (nếu hệ thống của bạn dùng flag isDeleted)
      const activeItems = allItems.filter((item) => item.isDeleted !== true);
      setAllActiveCustomers(activeItems);

      // Thực hiện bộ lọc Client-side theo logic tìm kiếm của bạn
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

  // 4. CRUD Operations đồng bộ hoàn toàn với style của Supplier
  const handleAddCustomer = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...normalizeCustomerPayload(data),
        code: nextCode, // Tự động gán mã KHxxx theo logic cũ của bạn
      };
      await customersService.create(payload);
      toast.success("Thêm khách hàng mới thành công!");
      setIsModalOpen(false);
      fetchCustomers();
      return true;
    } catch (error) {
      console.error("useCustomers - handleAddCustomer error:", error);
      const serverMsg =
        error?.response?.data?.message || error?.response?.data?.error;
      toast.error(serverMsg || "Không thể thêm khách hàng. Vui lòng thử lại.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

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
        error?.response?.data?.message || error?.response?.data?.error;
      toast.error(
        serverMsg || "Lỗi khi cập nhật khách hàng. Hãy kiểm tra lại dữ liệu.",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    setIsSubmitting(true);
    try {
      // Gọi tới hàm delete từ service của bạn
      await customersService.delete(selectedCustomer.id);
      toast.success(`Đã xóa khách hàng "${selectedCustomer.fullName}"`);
      setIsDeleteModalOpen(false);
      setSelectedCustomer(null);

      // Nếu xóa item cuối cùng của trang hiện tại, lùi lại 1 trang
      if (customers.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchCustomers();
      }
      return true;
    } catch (error) {
      console.error("useCustomers - handleDeleteCustomer error:", error);
      const serverMsg =
        error?.response?.data?.message || error?.response?.data?.error;
      toast.error(serverMsg || "Không thể xóa khách hàng này.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Các hàm mở Modal đồng bộ tên gọi
  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  // Tính toán số trang (Tổng số item lọc được / kích thước trang)
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return {
    customers, // Danh sách khách hàng đã được phân trang (tương đương paginatedCustomers cũ)
    allActiveCustomers, // Toàn bộ danh sách khách hàng đang hoạt động (chưa xóa)
    loading,
    isFetching,
    isSubmitting,
    isFirstFetch,
    search,
    debouncedSearch,
    setSearch, // Hàm binding trực tiếp vào ô Input tìm kiếm
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalCount,
    totalPages,
    isModalOpen, // Quản lý Modal Form (Thêm/Sửa)
    setIsModalOpen,
    isDeleteModalOpen, // Quản lý Modal Xác nhận xóa
    setIsDeleteModalOpen,
    selectedCustomer, // Object Customer đang được chọn để Sửa hoặc Xóa (tương đương editingCustomer / deletingCustomer)
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
