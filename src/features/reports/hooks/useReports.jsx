import { useState, useEffect, useMemo, useCallback } from "react";
import productService from "../../products/api/productsService";
import categoryService from "../../categories/api/categoriesService";
import purchasesService from "../../imports/api/purchasesService";

export function useReports() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedDateRange, setSelectedDateRange] = useState("month"); // 'month', 'lastMonth', 'quarter', 'custom'
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all required data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, purchaseRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        purchasesService.getAll(),
      ]);

      setProducts(Array.isArray(prodRes) ? prodRes : prodRes?.data || []);
      setCategories(Array.isArray(catRes) ? catRes : catRes?.data || []);
      setPurchases(
        Array.isArray(purchaseRes) ? purchaseRes : purchaseRes?.data || [],
      );
    } catch (error) {
      console.error("Error fetching reports data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Determine period start and end dates
  const dateRange = useMemo(() => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    if (selectedDateRange === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (selectedDateRange === "lastMonth") {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else if (selectedDateRange === "quarter") {
      const qStartMonth = Math.floor(now.getMonth() / 3) * 3;
      start = new Date(now.getFullYear(), qStartMonth, 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), qStartMonth + 3, 0, 23, 59, 59, 999);
    } else if (selectedDateRange === "custom") {
      start = customStartDate
        ? new Date(customStartDate)
        : new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end = customEndDate
        ? new Date(customEndDate)
        : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      // Ensure custom dates cover full days
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }

    return { start, end };
  }, [selectedDateRange, customStartDate, customEndDate]);

  // Process reports data for each product
  const reportData = useMemo(() => {
    const { start, end } = dateRange;

    // Only completed (status = 2) purchases
    const completedPurchases = purchases.filter((p) => {
      const statusValue = p.status ?? p.Status;
      return Number(statusValue) === 2;
    });

    return products.map((product) => {
      // --- Purchases before the period (for opening stock) ---
      let qImportBefore = 0;
      let qExportBefore = 0;

      // --- Purchases within the period ---
      let qImport = 0;
      let importVal = 0;
      let qExport = 0;
      let exportVal = 0;

      // --- All-time import for weighted average cost ---
      let totalImportQtyAllTime = 0;
      let totalImportCostAllTime = 0;

      completedPurchases.forEach((p) => {
        const typeValue = Number(p.type ?? p.Type);
        const dateStr =
          p.createDate || p.purchaseDate || p.receiptDate || p.createdAt;
        if (!dateStr) return;
        const d = new Date(dateStr);
        const items = p.items || [];

        items.forEach((item) => {
          if (Number(item.productId) !== Number(product.id)) return;
          const qty = item.quantity || 0;
          const price = item.unitCost || item.unitCost || 0;

          // Accumulate for weighted average cost (all-time imports)
          if (typeValue === 1) {
            totalImportQtyAllTime += qty;
            totalImportCostAllTime += qty * price;
          }

          // Before period start → contributes to opening stock
          if (d < start) {
            if (typeValue === 1) qImportBefore += qty;
            else if (typeValue === 2) qExportBefore += qty;
          }
          // Within period → contributes to period import/export
          else if (d >= start && d <= end) {
            if (typeValue === 1) {
              qImport += qty;
              importVal += qty * price;
            } else if (typeValue === 2) {
              qExport += qty;
              exportVal += qty * price;
            }
          }
        });
      });

      // Weighted average cost (from all-time completed imports)
      let averageCost =
        product.originalPrice || product.price || product.sellingPrice || 0;
      if (totalImportQtyAllTime > 0) {
        averageCost = totalImportCostAllTime / totalImportQtyAllTime;
      }
      // Avoid a cost of 1 or less if possible
      if (
        averageCost <= 1 &&
        (product.originalPrice > 1 || product.sellingPrice > 1)
      ) {
        averageCost = product.originalPrice || product.sellingPrice || 0;
      }

      // Opening Qty = total completed imports before start - total completed exports before start
      const openingQty = Math.max(0, qImportBefore - qExportBefore);

      // Opening Value = openingQty * averageCost
      const openingVal = openingQty * averageCost;

      // Closing Qty = openingQty + qImport - qExport (must not go negative)
      const closingQty = Math.max(0, openingQty + qImport - qExport);

      // Closing Value = closingQty * averageCost (never negative when qty = 0)
      const closingVal = closingQty > 0 ? closingQty * averageCost : 0;

      return {
        id: product.id,
        code: product.code || `PROD-${product.id}`,
        name: product.name,
        categoryId: product.categoryId,
        openingQty,
        openingVal,
        importQty: qImport,
        importVal,
        exportQty: qExport,
        exportVal,
        closingQty,
        closingVal,
      };
    });
  }, [products, purchases, dateRange]);

  // Filters & Search
  const filteredReportData = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return reportData.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword);

      const matchesCategory =
        selectedCategory === "all" ||
        Number(item.categoryId) === Number(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [reportData, search, selectedCategory]);

  // Paginated data
  const totalCount = filteredReportData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Reset page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedDateRange, pageSize]);

  const paginatedReportData = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredReportData.slice(startIdx, startIdx + pageSize);
  }, [filteredReportData, currentPage, pageSize]);

  // Column totals for the footer
  const columnTotals = useMemo(() => {
    return filteredReportData.reduce(
      (totals, item) => {
        totals.openingQty += item.openingQty;
        totals.openingVal += item.openingVal;
        totals.importQty += item.importQty;
        totals.importVal += item.importVal;
        totals.exportQty += item.exportQty;
        totals.exportVal += item.exportVal;
        totals.closingQty += item.closingQty;
        totals.closingVal += item.closingVal;
        return totals;
      },
      {
        openingQty: 0,
        openingVal: 0,
        importQty: 0,
        importVal: 0,
        exportQty: 0,
        exportVal: 0,
        closingQty: 0,
        closingVal: 0,
      },
    );
  }, [filteredReportData]);

  // Bottom Dashboard Stats
  const dashboardStats = useMemo(() => {
    const now = new Date();
    // 1. Current stock qty & total value
    const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalVal = products.reduce(
      (sum, p) =>
        sum +
        (p.quantity || 0) * (p.originalPrice || p.price || p.sellingPrice || 0),
      0,
    );

    // 2. Count low stock products (<= 10)
    const lowStockCount = products.filter(
      (p) => (p.quantity || 0) <= 10,
    ).length;

    // Only completed purchases
    const completedImportPurchases = purchases.filter((p) => {
      const statusValue = Number(p.status ?? p.Status);
      const typeValue = Number(p.type ?? p.Type);
      return statusValue === 2 && typeValue === 1;
    });

    // 3. Count completed import purchases in selected period
    const { start, end } = dateRange;
    const periodImports = completedImportPurchases.filter((p) => {
      const dateStr =
        p.createDate || p.purchaseDate || p.receiptDate || p.createdAt;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return d >= start && d <= end;
    });
    const importCount = periodImports.length;

    // Calculate days in period to find daily average imports
    const diffTime = Math.abs(end - start);
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const averageImportsPerDay = (importCount / diffDays).toFixed(1);

    // Dynamic month-over-month comparisons (premium detail)
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

    // Stock at end of last month = sum of all completed imports up to end of last month - exports
    const lastMonthClosingStock = products.reduce((sum, p) => {
      let qIn = 0;
      let qOut = 0;
      purchases.forEach((pur) => {
        const statusValue = Number(pur.status ?? pur.Status);
        const typeValue = Number(pur.type ?? pur.Type);
        if (statusValue !== 2) return;
        const dateStr =
          pur.createDate ||
          pur.purchaseDate ||
          pur.receiptDate ||
          pur.createdAt;
        if (!dateStr) return;
        const d = new Date(dateStr);
        if (d > endOfLastMonth) return;
        (pur.items || []).forEach((item) => {
          if (Number(item.productId) !== Number(p.id)) return;
          const qty = item.quantity || 0;
          if (typeValue === 1) qIn += qty;
          else if (typeValue === 2) qOut += qty;
        });
      });
      return sum + Math.max(0, qIn - qOut);
    }, 0);

    const stockPercentChange =
      lastMonthClosingStock > 0
        ? (
            ((totalStock - lastMonthClosingStock) / lastMonthClosingStock) *
            100
          ).toFixed(1)
        : "0.0";

    return {
      totalStock,
      totalVal,
      lowStockCount,
      importCount,
      averageImportsPerDay,
      stockPercentChange,
    };
  }, [products, purchases, dateRange]);

  // Export to Excel / CSV function
  const handleExport = useCallback(() => {
    let csvContent = "\uFEFF"; // UTF-8 BOM for Excel compatibility
    csvContent +=
      "MÃ LINH KIỆN,TÊN LINH KIỆN,TỒN ĐẦU KỲ (Số lượng),TỒN ĐẦU KỲ (Giá trị),NHẬP TRONG KỲ (Số lượng),NHẬP TRONG KỲ (Giá trị),XUẤT TRONG KỲ (Số lượng),XUẤT TRONG KỲ (Giá trị),TỒN CUỐI KỲ (Số lượng),TỒN CUỐI KỲ (Giá trị)\n";

    filteredReportData.forEach((row) => {
      csvContent += `"${row.code}","${row.name}",${row.openingQty},${row.openingVal},${row.importQty},${row.importVal},${row.exportQty},${row.exportVal},${row.closingQty},${row.closingVal}\n`;
    });

    // Add totals row
    csvContent += `"TỔNG CỘNG","",${columnTotals.openingQty},${columnTotals.openingVal},${columnTotals.importQty},${columnTotals.importVal},${columnTotals.exportQty},${columnTotals.exportVal},${columnTotals.closingQty},${columnTotals.closingVal}\n`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `bao_cao_nhap_xuat_ton_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredReportData, columnTotals]);

  return {
    reportData: paginatedReportData,
    columnTotals,
    dashboardStats,
    categories,
    loading,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    selectedDateRange,
    setSelectedDateRange,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    handleExport,
    dateRange,
  };
}
