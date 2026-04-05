import { useCallback, useEffect, useMemo, useState } from "react";
import { customers, products, users } from "../../../utils/mockData.js";

const RECEIPT_SEED = [
  {
    id: 1,
    code: "XK-20260323-001",
    customerId: 2,
    createdById: users[0]?.id,
    date: "2026-03-23T10:20:00",
    note: "Giao màn hình và SSD cho khách doanh nghiệp.",
    warehouse: "Kho Linh kiện A",
    referenceCode: "SO-202603-2201",
    status: "completed",
    items: [
      { productId: 1, quantity: 4, unitPrice: products[0]?.price || 0 },
      { productId: 5, quantity: 6, unitPrice: products[4]?.price || 0 },
    ],
  },
  {
    id: 2,
    code: "XK-20260323-002",
    customerId: 3,
    createdById: users[1]?.id,
    date: "2026-03-23T14:10:00",
    note: "Đơn giao nhanh, chờ xác nhận từ bộ phận vận chuyển.",
    warehouse: "Kho Phụ kiện B",
    referenceCode: "SO-202603-2205",
    status: "pending",
    items: [
      { productId: 4, quantity: 10, unitPrice: products[3]?.price || 0 },
      { productId: 6, quantity: 8, unitPrice: products[5]?.price || 0 },
    ],
  },
  {
    id: 3,
    code: "XK-20260322-009",
    customerId: 4,
    createdById: users[2]?.id,
    date: "2026-03-22T16:45:00",
    note: "Xuất pin thay thế cho đơn bảo hành.",
    warehouse: "Kho Linh kiện A",
    referenceCode: "SO-202603-2178",
    status: "completed",
    items: [
      { productId: 2, quantity: 5, unitPrice: products[1]?.price || 0 },
      { productId: 3, quantity: 12, unitPrice: products[2]?.price || 0 },
    ],
  },
  {
    id: 4,
    code: "XK-20260322-007",
    customerId: 5,
    createdById: users[1]?.id,
    date: "2026-03-22T09:00:00",
    note: "Hủy do khách đổi sang cấu hình khác.",
    warehouse: "Kho Phụ kiện B",
    referenceCode: "SO-202603-2169",
    status: "cancelled",
    items: [
      { productId: 1, quantity: 2, unitPrice: products[0]?.price || 0 },
      { productId: 4, quantity: 6, unitPrice: products[3]?.price || 0 },
    ],
  },
  {
    id: 5,
    code: "XK-20260321-011",
    customerId: 1,
    createdById: users[3]?.id,
    date: "2026-03-21T15:30:00",
    note: "Xuất thử nghiệm cho dự án demo showroom.",
    warehouse: "Kho Linh kiện A",
    referenceCode: "SO-202603-2134",
    status: "completed",
    items: [
      { productId: 5, quantity: 3, unitPrice: products[4]?.price || 0 },
      { productId: 6, quantity: 4, unitPrice: products[5]?.price || 0 },
    ],
  },
];

const STATUS_LABELS = {
  completed: "Đã xuất kho",
  pending: "Chờ duyệt xuất",
  cancelled: "Đã hủy",
  draft: "Bản nháp",
};
const DATE_RANGE_FILTERS = {
  all: () => true,
  last7: (date) => new Date(date) >= new Date("2026-03-17T00:00:00"),
  last14: (date) => new Date(date) >= new Date("2026-03-10T00:00:00"),
  month: (date) => new Date(date).getMonth() === 2,
};

function formatUserName(user) {
  if (!user) return "Chưa gán";
  return (
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.userName ||
    "Chưa gán"
  );
}

function enrichReceipt(receipt) {
  const customer = customers.find((item) => item.id === receipt.customerId);
  const user = users.find((item) => item.id === receipt.createdById);
  const items = (receipt.items || []).map((item, index) => {
    const product = products.find(
      (productItem) => productItem.id === item.productId,
    );
    const lineTotal = item.quantity * item.unitPrice;
    return {
      ...item,
      id: `${receipt.id}-${item.productId}-${index}`,
      productName: product?.name || "Sản phẩm chưa xác định",
      imageUrl: product?.imageUrl || "",
      sku: product?.code || "N/A",
      unit: "Cái",
      lineTotal,
      categoryId: product?.categoryId,
      description: product?.description || "",
    };
  });
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const discountAmount = 0;
  const totalAmount = Math.max(0, subTotal - discountAmount);
  return {
    ...receipt,
    customerName: customer?.fullName || "Khách hàng chưa xác định",
    customerAddress: customer?.address || "Chưa cập nhật",
    customerPhone: customer?.phoneNumber || "Chưa cập nhật",
    operatorName: formatUserName(user),
    totalQuantity,
    itemCount: items.length,
    subTotal,
    discountAmount,
    totalAmount,
    statusLabel: STATUS_LABELS[receipt.status] || "Không xác định",
    itemSummary: items
      .map((item) => `${item.quantity} x ${item.productName}`)
      .join(", "),
    items,
  };
}

function buildReceipts() {
  return RECEIPT_SEED.map(enrichReceipt).sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
}

function buildEmptyReceipt() {
  return {
    id: null,
    code: "XK-DRAFT-001",
    customerId: "",
    createdById: users[0]?.id,
    date: "2026-03-23",
    note: "",
    warehouse: "Kho Linh kiện A",
    referenceCode: "",
    status: "draft",
    items: [
      {
        id: "draft-1",
        productId: products[0]?.id || "",
        productName: products[0]?.name || "",
        imageUrl: products[0]?.imageUrl || "",
        sku: products[0]?.code || "",
        quantity: 1,
        unitPrice: products[0]?.price || 0,
        lineTotal: products[0]?.price || 0,
        unit: "Cái",
      },
    ],
  };
}

export function useExports() {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [receipts, setReceipts] = useState(() => buildReceipts());
  const pageSize = 5;

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
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCustomer, selectedStatus, selectedDateRange]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
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
  const createEmptyReceipt = useCallback(() => buildEmptyReceipt(), []);
  const deleteReceipt = useCallback((id) => {
    setReceipts((prev) =>
      prev.filter((receipt) => String(receipt.id) !== String(id)),
    );
  }, []);

  return {
    products,
    customers,
    users,
    receipts,
    paginatedReceipts,
    getReceiptById,
    buildEmptyReceipt: createEmptyReceipt,
    deleteReceipt,
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
  };
}
