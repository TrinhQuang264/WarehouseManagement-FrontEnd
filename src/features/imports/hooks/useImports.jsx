import { useCallback, useEffect, useMemo, useState } from "react";
import purchasesService from "../api/purchasesService";
import productsService from "../../products/api/productsService";
import suppliersService from "../../suppliers/api/suppliersService";
import categoryService from "../../categories/api/categoriesService";
import { toast } from "../../../utils/toast";

const STATUS_LABELS = {
  completed: "Đã nhập kho",
  pending: "Chờ xác nhận",
  cancelled: "Đã hủy",
  draft: "Bản nháp",
};

const STATUS_KEY_MAP = {
  0: "draft",
  1: "pending",
  2: "completed",
  3: "cancelled",
};

const DATE_RANGE_FILTERS = {
  all: () => true,
  last7: (date) => {
    const d = new Date(date);
    const limit = new Date();
    limit.setDate(limit.getDate() - 7);
    limit.setHours(0, 0, 0, 0);
    return d >= limit;
  },
  last14: (date) => {
    const d = new Date(date);
    const limit = new Date();
    limit.setDate(limit.getDate() - 14);
    limit.setHours(0, 0, 0, 0);
    return d >= limit;
  },
  month: (date) => {
    const d = new Date(date);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  },
};

function formatUserName(user) {
  if (!user) return "Chưa gán";
  return (
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.userName ||
    "Chưa gán"
  );
}

function buildEmptyReceipt(products) {
  return {
    id: null,
    code: "NK-DRAFT",
    supplierId: "",
    createdById: null,
    date: new Date().toISOString().slice(0, 10),
    note: "",
    warehouse: "1",
    referenceCode: "",
    status: "draft",
    items: [],
  };
}

export function useImports() {
  const [search, setSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [productsData, suppliersData, purchasesData, categoriesData] =
        await Promise.all([
          productsService.getAll(),
          suppliersService.getAll(),
          purchasesService.getAll(),
          categoryService.getAll(),
        ]);

      // Handle potentially wrapped responses
      const fetchedProducts = productsData.data || productsData || [];
      const fetchedSuppliers = suppliersData.data || suppliersData || [];
      const fetchedPurchases = purchasesData.data || purchasesData || [];
      const fetchedCategories = categoriesData?.data || categoriesData || [];

      const categoryMap = new Map(
        (Array.isArray(fetchedCategories) ? fetchedCategories : []).map((c) => [
          Number(c.id),
          c.name,
        ]),
      );

      const productsWithCategory = (
        Array.isArray(fetchedProducts) ? fetchedProducts : []
      ).map((p) => ({
        ...p,
        categoryName: categoryMap.get(Number(p.categoryId)) || null,
      }));

      setProducts(productsWithCategory);
      setSuppliers(Array.isArray(fetchedSuppliers) ? fetchedSuppliers : []);

      console.log("DEBUG - fetchedPurchases:", fetchedPurchases);
      // Map purchases to receipts format
      const mappedReceipts = (
        Array.isArray(fetchedPurchases) ? fetchedPurchases : []
      )
        .filter((p) => Number(p.type) === 1)
        .map((p) => {
          const supplier = (
            Array.isArray(fetchedSuppliers) ? fetchedSuppliers : []
          ).find((s) => s.id === p.supplierId);

          let items = p.items || [];
          if (items.length === 0 && p.id) {
            // If items are not included in getAll, they might need to be fetched separately,
            // but for now we map what we have.
          }

          const mappedItems = items.map((item, index) => {
            const product = (
              Array.isArray(fetchedProducts) ? fetchedProducts : []
            ).find((prod) => prod.id === item.productId);
            const qty = item.quantity || 1;
            const price = item.unitCost || item.unitPrice || 0;
            return {
              ...item,
              id: item.id || `${p.id}-${item.productId}-${index}`,
              productName:
                product?.name || item.productName || "Sản phẩm chưa xác định",
              imageUrl: product?.imageUrl || "",
              sku: product?.code || "N/A",
              unit: "Cái",
              quantity: qty,
              unitPrice: price,
              lineTotal: qty * price,
              categoryId: product?.categoryId,
              description: product?.description || "",
            };
          });

          const totalQuantity = mappedItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          const subTotal = mappedItems.reduce(
            (sum, item) => sum + item.lineTotal,
            0,
          );

          return {
            ...p,
            id: p.id,
            code: p.referenceCode || `NK-${p.id}`,
            supplierId: p.supplierId,
            date:
              p.createDate ||
              p.purchaseDate ||
              p.receiptDate ||
              p.createdAt ||
              new Date().toISOString(),
            note: p.note || "",
            referenceCode: p.referenceCode || "",
            status: STATUS_KEY_MAP[p.status ?? p.Status] || "draft",
            supplierName:
              p.supplierName ||
              supplier?.supplierName ||
              "Nhà cung cấp chưa xác định",
            supplierAddress: supplier?.address || "Chưa cập nhật",
            operatorName: "Hệ thống",
            items: mappedItems,
            itemCount: mappedItems.length,
            totalQuantity,
            subTotal,
            vatAmount: 0,
            totalAmount: subTotal,
            statusLabel:
              STATUS_LABELS[STATUS_KEY_MAP[p.status] || "draft"] ||
              "Không xác định",
            itemSummary: mappedItems
              .map((item) => `${item.quantity} x ${item.productName}`)
              .join(", "),
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log("DEBUG - final mappedReceipts:", mappedReceipts);
      setReceipts(mappedReceipts);
    } catch (error) {
      console.error("Error fetching data for imports:", error);
      toast.error("Không thể tải dữ liệu nhập kho.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredReceipts = useMemo(() => {
    const keyword = String(search ?? "")
      .trim()
      .toLowerCase();

    return receipts.filter((receipt) => {
      const matchesSearch =
        !keyword ||
        [
          receipt.code,
          receipt.supplierName,
          receipt.operatorName,
          receipt.referenceCode,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(keyword),
        );

      const matchesSupplier =
        selectedSupplier === "all" ||
        String(receipt.supplierId) === selectedSupplier;
      const matchesStatus =
        selectedStatus === "all" || receipt.status === selectedStatus;
      const matchesDate = (() => {
        if (selectedDateRange && selectedDateRange.startsWith("date:")) {
          const selectedDateStr = selectedDateRange.replace("date:", "");
          const d = new Date(receipt.date);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          const receiptDateStr = `${year}-${month}-${day}`;
          return receiptDateStr === selectedDateStr;
        }
        return (
          DATE_RANGE_FILTERS[selectedDateRange] || DATE_RANGE_FILTERS.all
        )(receipt.date);
      })();

      return matchesSearch && matchesSupplier && matchesStatus && matchesDate;
    });
  }, [receipts, search, selectedSupplier, selectedStatus, selectedDateRange]);

  const totalCount = filteredReceipts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedSupplier, selectedStatus, selectedDateRange]);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedReceipts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReceipts.slice(start, start + pageSize);
  }, [filteredReceipts, currentPage]);

  const stats = useMemo(() => {
    const totalValue = receipts
      .filter((receipt) => receipt.status === "completed")
      .reduce((sum, receipt) => sum + receipt.totalAmount, 0);
    const pendingCount = receipts.filter(
      (receipt) => receipt.status === "pending",
    ).length;
    const completedCount = receipts.filter(
      (receipt) => receipt.status === "completed",
    ).length;

    return {
      totalReceipts: receipts.length,
      totalValue,
      pendingCount,
      completedCount,
    };
  }, [receipts]);

  const getReceiptById = useCallback(
    (id) =>
      receipts.find((receipt) => String(receipt.id) === String(id)) || null,
    [receipts],
  );

  const createEmptyReceipt = useCallback(
    () => buildEmptyReceipt(products),
    [products],
  );

  const deleteReceipt = useCallback((id) => {
    // We would call an API here if we had a DELETE endpoint
    // purchasesService.delete(id);
    setReceipts((prev) =>
      prev.filter((receipt) => String(receipt.id) !== String(id)),
    );
  }, []);

  const createReceipt = async (receiptData, { submit = false } = {}) => {
    const supplier = suppliers.find(
      (s) => String(s.id) === String(receiptData.supplierId),
    );
    const payload = {
      supplierId: receiptData.supplierId,
      warehouseId: 1,
      type: 1,
      Type: 1,
      supplierName: supplier
        ? supplier.supplierName
        : "Nhà cung cấp chưa xác định",
      receiptDate: receiptData.date
        ? new Date(receiptData.date).toISOString()
        : new Date().toISOString(),
      referenceCode: receiptData.referenceCode || "",
      note: receiptData.note || "",
      items: (receiptData.items || []).map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitCost: item.unitPrice || 0,
      })),
      ...(submit ? { status: 1, Status: 1 } : {}),
    };

    console.log(
      "[useImports.createReceipt] Payload:",
      payload,
      "submit:",
      submit,
    );
    try {
      const response = await purchasesService.create(payload);
      console.log("[useImports.createReceipt] Response:", response);

      // Update local state by re-fetching or optimistic UI update
      // For simplicity, we just trigger a page reload or let the component do it
      // but returning response is enough.
      return response;
    } catch (error) {
      console.error("Error creating receipt:", error);
      throw error;
    }
  };

  const updateReceipt = async (id, receiptData, { submit = false } = {}) => {
    const supplier = suppliers.find(
      (s) => String(s.id) === String(receiptData.supplierId),
    );
    const payload = {
      id: id,
      supplierId: receiptData.supplierId,
      warehouseId: 1,
      type: 1,
      Type: 1,
      supplierName: supplier
        ? supplier.supplierName
        : "Nhà cung cấp chưa xác định",
      receiptDate: receiptData.date
        ? new Date(receiptData.date).toISOString()
        : new Date().toISOString(),
      referenceCode: receiptData.referenceCode || "",
      note: receiptData.note || "",
      items: (receiptData.items || []).map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitCost: item.unitPrice || 0,
      })),
      ...(submit ? { status: 1, Status: 1 } : {}),
    };

    console.log(
      "[useImports.updateReceipt] Payload:",
      payload,
      "submit:",
      submit,
    );
    try {
      const response = await purchasesService.update(id, payload);
      console.log("[useImports.updateReceipt] Response:", response);
      return response;
    } catch (error) {
      console.error("Error updating receipt:", error);
      throw error;
    }
  };
  const submitReceipt = async (receiptOrId) => {
    const id = typeof receiptOrId === "object" ? receiptOrId.id : receiptOrId;
    const receipt =
      typeof receiptOrId === "object" ? receiptOrId : getReceiptById(id);

    console.log("[useImports.submitReceipt] Receipt to submit:", receipt);
    if (
      receipt &&
      !(
        receipt.status === "draft" ||
        receipt.status === 0 ||
        receipt.status === "0"
      )
    ) {
      throw new Error("Chỉ phiếu ở trạng thái  mới được gửi duyệt.");
    }

    try {
      console.log("[useImports.submitReceipt] Confirming receipt:", id);
      const response = await purchasesService.confirm(id);
      console.log(
        "[useImports.submitReceipt] Response from confirm:",
        response,
      );
      await fetchData();
      return response;
    } catch (error) {
      console.error("Error submitting receipt:", error);
      throw error;
    }
  };

  return {
    submitReceipt,
    products,
    suppliers,
    receipts,
    paginatedReceipts,
    getReceiptById,
    buildEmptyReceipt: createEmptyReceipt,
    deleteReceipt,
    createReceipt,
    updateReceipt,
    stats,
    search,
    setSearch,
    selectedSupplier,
    setSelectedSupplier,
    selectedStatus,
    setSelectedStatus,
    selectedDateRange,
    setSelectedDateRange,
    currentPage,
    setCurrentPage,
    totalCount,
    pageSize,
    totalPages,
    isLoading,
    refreshList: fetchData,
  };
}
