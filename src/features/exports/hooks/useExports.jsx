import { useCallback, useEffect, useMemo, useState } from "react";
import purchasesService from "../../imports/api/purchasesService";
import productsService from "../../products/api/productsService";
import customersService from "../../customers/api/customersService";
import { toast } from "../../../utils/toast.js";

const STATUS_LABELS = {
  completed: "Đã xuất kho",
  pending: "Chờ duyệt xuất",
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
  last7: (date) =>
    new Date(date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  last14: (date) =>
    new Date(date) >= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  month: (date) => new Date(date).getMonth() === new Date().getMonth(),
};

function buildEmptyReceipt(products) {
  const defaultProduct = products && products.length > 0 ? products[0] : null;
  return {
    id: null,
    code: "XK-DRAFT",
    customerId: "",
    createdById: null,
    date: new Date().toISOString().slice(0, 10),
    note: "",
    warehouse: "1",
    referenceCode: "",
    status: "draft",
    items: defaultProduct
      ? [
          {
            id: "draft-1",
            productId: defaultProduct.id,
            productName: defaultProduct.name || "",
            imageUrl: defaultProduct.imageUrl || "",
            sku: defaultProduct.code || "",
            quantity: 1,
            unitPrice: defaultProduct.sellingPrice || defaultProduct.price || 0,
            lineTotal: defaultProduct.sellingPrice || defaultProduct.price || 0,
            unit: "Cái",
          },
        ]
      : [],
  };
}

export function useExports() {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [productsData, customersData, purchasesData] = await Promise.all([
        productsService.getAll(),
        customersService.getAll(),
        purchasesService.getAll(),
      ]);

      const fetchedProducts = productsData?.data || productsData || [];
      const fetchedCustomers = Array.isArray(customersData)
        ? customersData
        : customersData?.data || [];
      const fetchedPurchases = purchasesData?.data || purchasesData || [];

      setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
      setCustomers(Array.isArray(fetchedCustomers) ? fetchedCustomers : []);

      // Only keep type === 2 (export) purchases
      const exportPurchases = (
        Array.isArray(fetchedPurchases) ? fetchedPurchases : []
      ).filter((p) => Number(p.type) === 2);

      const mappedReceipts = exportPurchases
        .map((p) => {
          const customer = (
            Array.isArray(fetchedCustomers) ? fetchedCustomers : []
          ).find((c) => c.id === p.customerId);

          const items = (p.items || []).map((item, index) => {
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

          const totalQuantity = items.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          const subTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

          return {
            ...p,
            id: p.id,
            code: p.referenceCode || `XK-${p.id}`,
            customerId: p.customerId,
            date: p.receiptDate || p.createdAt || new Date().toISOString(),
            note: p.note || "",
            referenceCode: p.referenceCode || "",
            status: STATUS_KEY_MAP[p.status ?? p.Status] || "draft",
            customerName:
              p.customerName ||
              customer?.fullName ||
              customer?.name ||
              "Khách hàng chưa xác định",
            customerAddress: customer?.address || "Chưa cập nhật",
            customerPhone: customer?.phoneNumber || "Chưa cập nhật",
            operatorName: "Hệ thống",
            items,
            itemCount: items.length,
            totalQuantity,
            subTotal,
            discountAmount: 0,
            totalAmount: subTotal,
            statusLabel:
              STATUS_LABELS[STATUS_KEY_MAP[p.status] || "draft"] ||
              "Không xác định",
            itemSummary: items
              .map((item) => `${item.quantity} x ${item.productName}`)
              .join(", "),
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log("DEBUG - final Export mappedReceipts:", mappedReceipts);
      setReceipts(mappedReceipts);
    } catch (error) {
      console.error("Error fetching data for exports:", error);
      toast.error("Không thể tải dữ liệu xuất kho.");
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
          receipt.customerName,
          receipt.operatorName,
          receipt.referenceCode,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(keyword),
        );

      const matchesCustomer =
        selectedCustomer === "all" ||
        String(receipt.customerId) === selectedCustomer;
      const matchesStatus =
        selectedStatus === "all" || receipt.status === selectedStatus;
      const matchesDate = (
        DATE_RANGE_FILTERS[selectedDateRange] || DATE_RANGE_FILTERS.all
      )(receipt.date);

      return matchesSearch && matchesCustomer && matchesStatus && matchesDate;
    });
  }, [receipts, search, selectedCustomer, selectedStatus, selectedDateRange]);

  const totalCount = filteredReceipts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCustomer, selectedStatus, selectedDateRange]);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedReceipts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReceipts.slice(start, start + pageSize);
  }, [filteredReceipts, currentPage]);

  const stats = useMemo(() => {
    const totalValue = receipts.reduce(
      (sum, receipt) => sum + receipt.totalAmount,
      0,
    );
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
    setReceipts((prev) =>
      prev.filter((receipt) => String(receipt.id) !== String(id)),
    );
  }, []);

  const createReceipt = async (receiptData, { submit = false } = {}) => {
    const customer = customers.find(
      (c) => String(c.id) === String(receiptData.customerId),
    );
    const payload = {
      type: 2,
      Type: 2,
      customerId: receiptData.customerId ? Number(receiptData.customerId) : 0,
      warehouseId: 1,
      customerName: customer
        ? customer.fullName || customer.name || ""
        : "Khách hàng chưa xác định",
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
      "[useExports.createReceipt] Payload:",
      payload,
      "submit:",
      submit,
    );
    try {
      const response = await purchasesService.create(payload);
      console.log("[useExports.createReceipt] Response:", response);
      return response;
    } catch (error) {
      console.error("Error creating export receipt:", error);
      throw error;
    }
  };

  const updateReceipt = async (id, receiptData, { submit = false } = {}) => {
    const customer = customers.find(
      (c) => String(c.id) === String(receiptData.customerId),
    );
    const payload = {
      id: id,
      type: 2,
      Type: 2,
      customerId: receiptData.customerId ? Number(receiptData.customerId) : 0,
      warehouseId: 1,
      customerName: customer
        ? customer.fullName || customer.name || ""
        : "Khách hàng chưa xác định",
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
      "[useExports.updateReceipt] Payload:",
      payload,
      "submit:",
      submit,
    );
    try {
      const response = await purchasesService.update(id, payload);
      console.log("[useExports.updateReceipt] Response:", response);
      return response;
    } catch (error) {
      console.error("Error updating export receipt:", error);
      throw error;
    }
  };
  const submitReceipt = async (id) => {
    const receipt = getReceiptById(id);
    console.log("[useExports.submitReceipt] Receipt to submit:", receipt);
    if (!receipt) return;
    if (
      !(
        receipt.status === "draft" ||
        receipt.status === 0 ||
        receipt.status === "0"
      )
    ) {
      throw new Error("Chỉ phiếu ở trạng thái bản nháp mới được gửi duyệt.");
    }

    try {
      // Build payload keeping all original data, only update status to 1
      const payload = {
        id: id,
        type: 2,
        Type: 2,
        customerId: receipt.customerId,
        warehouseId: 1,
        customerName: receipt.customerName,
        receiptDate: receipt.date,
        referenceCode: receipt.referenceCode || "",
        note: receipt.note || "",
        status: 1,
        Status: 1,
        items: (receipt.items || []).map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitCost: item.unitPrice || 0,
        })),
      };
      console.log("[useExports.submitReceipt] Submitting payload:", payload);
      const response = await purchasesService.update(id, payload);
      console.log("[useExports.submitReceipt] Response from update:", response);
      await fetchData();
      return response;
    } catch (error) {
      console.error("Error submitting export receipt:", error);
      throw error;
    }
  };

  return {
    submitReceipt,
    products,
    customers,
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
    selectedCustomer,
    setSelectedCustomer,
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
