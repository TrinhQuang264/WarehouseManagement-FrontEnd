import { useCallback, useEffect, useMemo, useState } from 'react';
import { products, suppliers, users } from '../../../utils/mockData.js';

const RECEIPT_SEED = [
  {
    id: 1,
    code: 'NK-20260323-001',
    supplierId: 1,
    createdById: users[0]?.id,
    date: '2026-03-23T09:15:00',
    note: 'Nhập lô màn hình OLED và pin thay thế theo kế hoạch tuần 12.',
    warehouse: 'Kho Linh kiện A',
    referenceCode: 'PO-202603-8821',
    status: 'completed',
    items: [
      { productId: 1, quantity: 10, unitPrice: 1200000 },
      { productId: 2, quantity: 6, unitPrice: 2800000 },
      { productId: 5, quantity: 12, unitPrice: 900000 },
    ],
  },
  {
    id: 2,
    code: 'NK-20260323-002',
    supplierId: 2,
    createdById: users[1]?.id,
    date: '2026-03-23T11:40:00',
    note: 'Chờ đối chiếu chứng từ gốc từ nhà cung cấp.',
    warehouse: 'Kho Linh kiện A',
    referenceCode: 'PO-202603-8870',
    status: 'pending',
    items: [
      { productId: 3, quantity: 18, unitPrice: 350000 },
      { productId: 4, quantity: 25, unitPrice: 180000 },
    ],
  },
  {
    id: 3,
    code: 'NK-20260322-014',
    supplierId: 3,
    createdById: users[0]?.id,
    date: '2026-03-22T15:10:00',
    note: 'Bổ sung SSD cho đơn hàng doanh nghiệp.',
    warehouse: 'Kho Phụ kiện B',
    referenceCode: 'PO-202603-8744',
    status: 'completed',
    items: [
      { productId: 5, quantity: 30, unitPrice: 920000 },
    ],
  },
  {
    id: 4,
    code: 'NK-20260322-013',
    supplierId: 5,
    createdById: users[2]?.id,
    date: '2026-03-22T08:25:00',
    note: 'Hủy do sai giá nhập trên hóa đơn.',
    warehouse: 'Kho Linh kiện A',
    referenceCode: 'PO-202603-8701',
    status: 'cancelled',
    items: [
      { productId: 6, quantity: 14, unitPrice: 610000 },
      { productId: 3, quantity: 20, unitPrice: 345000 },
    ],
  },
  {
    id: 5,
    code: 'NK-20260321-009',
    supplierId: 4,
    createdById: users[3]?.id,
    date: '2026-03-21T16:45:00',
    note: 'Nhập hàng phụ kiện tai nghe phục vụ mùa khuyến mãi.',
    warehouse: 'Kho Phụ kiện B',
    referenceCode: 'PO-202603-8615',
    status: 'completed',
    items: [
      { productId: 6, quantity: 22, unitPrice: 600000 },
      { productId: 4, quantity: 16, unitPrice: 182000 },
    ],
  },
  {
    id: 6,
    code: 'NK-20260320-005',
    supplierId: 2,
    createdById: users[1]?.id,
    date: '2026-03-20T10:05:00',
    note: 'Chờ kho xác nhận số lượng thực nhận.',
    warehouse: 'Kho Linh kiện A',
    referenceCode: 'PO-202603-8542',
    status: 'pending',
    items: [
      { productId: 1, quantity: 12, unitPrice: 1210000 },
      { productId: 2, quantity: 4, unitPrice: 2790000 },
    ],
  },
];

const STATUS_LABELS = {
  completed: 'Đã nhập kho',
  pending: 'Chờ xác nhận',
  cancelled: 'Đã hủy',
  draft: 'Bản nháp',
};

const DATE_RANGE_FILTERS = {
  all: () => true,
  last7: (date) => new Date(date) >= new Date('2026-03-17T00:00:00'),
  last14: (date) => new Date(date) >= new Date('2026-03-10T00:00:00'),
  month: (date) => new Date(date).getMonth() === 2,
};

function formatUserName(user) {
  if (!user) return 'Chưa gán';
  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName || 'Chưa gán';
}

function enrichReceipt(receipt) {
  const supplier = suppliers.find((item) => item.id === receipt.supplierId);
  const user = users.find((item) => item.id === receipt.createdById);
  const items = (receipt.items || []).map((item, index) => {
    const product = products.find((productItem) => productItem.id === item.productId);
    const lineTotal = item.quantity * item.unitPrice;

    return {
      ...item,
      id: `${receipt.id}-${item.productId}-${index}`,
      productName: product?.name || 'Sản phẩm chưa xác định',
      imageUrl: product?.imageUrl || '',
      sku: product?.code || 'N/A',
      unit: 'Cái',
      lineTotal,
      categoryId: product?.categoryId,
      description: product?.description || '',
    };
  });

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const vatAmount = 0;
  const totalAmount = subTotal + vatAmount;

  return {
    ...receipt,
    supplierName: supplier?.supplierName || 'Nhà cung cấp chưa xác định',
    operatorName: formatUserName(user),
    supplierAddress: supplier?.address || 'Chưa cập nhật',
    totalQuantity,
    itemCount: items.length,
    subTotal,
    vatAmount,
    totalAmount,
    statusLabel: STATUS_LABELS[receipt.status] || 'Không xác định',
    itemSummary: items.map((item) => `${item.quantity} x ${item.productName}`).join(', '),
    items,
  };
}

function buildReceipts() {
  return RECEIPT_SEED.map(enrichReceipt).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function buildEmptyReceipt() {
  return {
    id: null,
    code: 'NK-DRAFT-001',
    supplierId: '',
    createdById: users[0]?.id,
    date: '2026-03-23',
    note: '',
    warehouse: 'Kho Linh kiện A',
    referenceCode: '',
    status: 'draft',
    items: [
      {
        id: 'draft-1',
        productId: products[0]?.id || '',
        productName: products[0]?.name || '',
        imageUrl: products[0]?.imageUrl || '',
        sku: products[0]?.code || '',
        quantity: 1,
        unitPrice: products[0]?.importPrice || 0,
        lineTotal: products[0]?.importPrice || 0,
        unit: 'Cái',
      },
    ],
  };
}

export function useImports() {
  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [receipts, setReceipts] = useState(() => buildReceipts());
  const pageSize = 5;

  const filteredReceipts = useMemo(() => {
    const keyword = String(search ?? '').trim().toLowerCase();

    return receipts.filter((receipt) => {
      const matchesSearch = !keyword || [
        receipt.code,
        receipt.supplierName,
        receipt.operatorName,
        receipt.referenceCode,
      ].some((value) => String(value ?? '').toLowerCase().includes(keyword));

      const matchesSupplier = selectedSupplier === 'all' || String(receipt.supplierId) === selectedSupplier;
      const matchesStatus = selectedStatus === 'all' || receipt.status === selectedStatus;
      const matchesDate = (DATE_RANGE_FILTERS[selectedDateRange] || DATE_RANGE_FILTERS.all)(receipt.date);

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
    const totalValue = receipts.reduce((sum, receipt) => sum + receipt.totalAmount, 0);
    const pendingCount = receipts.filter((receipt) => receipt.status === 'pending').length;
    const completedCount = receipts.filter((receipt) => receipt.status === 'completed').length;

    return {
      totalReceipts: receipts.length,
      totalValue,
      pendingCount,
      completedCount,
    };
  }, [receipts]);

  const getReceiptById = useCallback((id) => receipts.find((receipt) => String(receipt.id) === String(id)) || null, [receipts]);
  const createEmptyReceipt = useCallback(buildEmptyReceipt, []);
  const deleteReceipt = useCallback((id) => {
    setReceipts((prev) => prev.filter((receipt) => String(receipt.id) !== String(id)));
  }, []);

  return {
    products,
    suppliers,
    users,
    receipts,
    paginatedReceipts,
    getReceiptById,
    buildEmptyReceipt: createEmptyReceipt,
    deleteReceipt,
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
  };
}
