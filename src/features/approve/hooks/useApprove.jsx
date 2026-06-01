import { useState, useEffect, useCallback, useMemo } from "react";
import purchasesService from "../../imports/api/purchasesService";
import toast from "../../../utils/toast";

const PAGE_SIZE = 5;

export function useApprove() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await purchasesService.getAll();
      const allItems = Array.isArray(response) ? response : response.data || [];

      // Filter receipts that are pending for approval (status is 1)
      const pendingItems = allItems.filter((item) => {
        const itemStatus = item.status ?? item.Status;
        return (
          (Number(itemStatus) === 1 ||
            String(itemStatus).toLowerCase() === "pending") &&
          !item.isCanceled
        );
      });

      setReceipts(pendingItems);
    } catch (error) {
      console.error("useApprove - Error fetching receipts:", error);
      toast.error("Không thể tải danh sách phiếu chờ duyệt.");
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  // Filtering based on search query and receipt type
  const filteredReceipts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const searchedReceipts = !keyword
      ? receipts
      : receipts.filter((receipt) =>
          [
            receipt.receiptCode,
            receipt.referenceCode,
            receipt.supplierName,
            receipt.customerName,
            receipt.note,
          ].some((val) =>
            String(val || "")
              .toLowerCase()
              .includes(keyword),
          ),
        );

    return searchedReceipts.filter((receipt) =>
      selectedType === "all"
        ? true
        : selectedType === "import"
          ? Number(receipt.type) === 1
          : Number(receipt.type) === 2,
    );
  }, [receipts, search, selectedType]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReceipts.length / PAGE_SIZE),
  );

  // Pagination
  const paginatedReceipts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredReceipts.slice(start, start + PAGE_SIZE);
  }, [filteredReceipts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedType]);

  // Approve a receipt
  const handleApprove = async (id) => {
    try {
      console.log("[useApprove.handleApprove] Approving receipt id:", id);
      await purchasesService.approve(id);
      console.log("[useApprove.handleApprove] Receipt approved successfully");
      toast.success("Duyệt phiếu thành công!");
      fetchReceipts();
      return true;
    } catch (error) {
      console.error("useApprove - handleApprove error:", error);
      const errorMsg = error?.response?.data || error?.message;
      toast.error(
        typeof errorMsg === "string" ? errorMsg : "Duyệt phiếu thất bại.",
      );
      return false;
    }
  };

  // Cancel a receipt
  const handleCancel = async (id, reason) => {
    try {
      await purchasesService.cancel(id, {
        reason: reason || "Hủy bỏ bởi quản trị viên",
      });
      toast.success("Đã hủy phiếu thành công!");
      fetchReceipts();
      return true;
    } catch (error) {
      console.error("useApprove - handleCancel error:", error);
      const errorMsg = error?.response?.data || error?.message;
      toast.error(
        typeof errorMsg === "string" ? errorMsg : "Hủy phiếu thất bại.",
      );
      return false;
    }
  };

  return {
    receipts: paginatedReceipts,
    allCount: filteredReceipts.length,
    loading,
    search,
    setSearch,
    selectedType,
    setSelectedType,
    currentPage,
    setCurrentPage,
    pageSize: PAGE_SIZE,
    totalPages,
    handleApprove,
    handleCancel,
    refreshList: fetchReceipts,
  };
}
