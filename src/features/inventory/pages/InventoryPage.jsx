import React, { useEffect, useCallback } from "react";
import { FileDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInventory } from "../hooks/useInventory.jsx";
import { useHeader } from "../../../contexts/HeaderContext.jsx";
import { downloadCSV } from "../../../utils/export.js";
import InventoryStats from "../components/InventoryStats.jsx";
import InventoryFilters from "../components/InventoryFilters.jsx";
import InventoryTable from "../components/InventoryTable.jsx";
import PaginationBar from "../../../components/ui/PaginationBar.jsx";
import Loading from "../../../components/ui/Loading.jsx";
import { toast } from "../../../utils/toast.js";
import "../styles/Inventory.css";
import Breadcrumb from "../../../components/ui/Breadcrumbs.jsx";

export default function InventoryPage() {
  const {
    products,
    categories,
    stats,
    loading,
    isFirstFetch,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    lowStockOnly,
    setLowStockOnly,
    currentPage,
    setCurrentPage,
    pageSize,
    totalCount,
  } = useInventory();

  const { setActionButton, setExtraActions, setOnSearch, resetHeader } =
    useHeader();
  const navigate = useNavigate();

  const handleExport = useCallback(() => {
    try {
      if (!products || products.length === 0) {
        toast.error("Không có dữ liệu để xuất");
        return;
      }
      const dataToExport = products.map((p) => ({
        "Mã sản phẩm": p.code || "",
        "Tên sản phẩm": p.name || "",
        Nhóm:
          categories.find((c) => c.id === p.categoryId)?.name || "Linh kiện",
        "Số lượng tồn": p.quantity ?? 0,
        "Đơn giá (VNĐ)": p.sellingPrice ?? 0,
        "Trạng thái": (p.quantity ?? 0) <= 10 ? "Tồn thấp" : "An toàn",
      }));
      downloadCSV(
        dataToExport,
        `TonKho_${new Date().toLocaleDateString("vi-VN").replace(/\//g, "-")}.csv`,
      );
      toast.success("Xuất dữ liệu thành công!");
    } catch (error) {
      console.error("[InventoryPage] Export error:", error);
      toast.error("Lỗi khi xuất dữ liệu");
    }
  }, [products, categories]);

  useEffect(() => {
    setActionButton({
      label: "Nhập hàng mới",
      icon: <Plus size={18} />,
      onClick: () => navigate("/import/create"),
      searchPlaceholder: "Tìm kiếm tên sản phẩm, mã SKU...",
      className:
        "shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]",
    });
    setExtraActions([
      {
        label: "Xuất báo cáo",
        icon: <FileDown size={18} />,
        onClick: handleExport,
        variant: "secondary",
      },
    ]);
    setOnSearch(() => setSearch);
    return () => resetHeader();
  }, [
    setActionButton,
    setExtraActions,
    setOnSearch,
    resetHeader,
    setSearch,
    handleExport,
  ]);

  if (isFirstFetch && loading) {
    return <Loading text="Đang tải dữ liệu kiểm kê..." />;
  }

  return (
    <div className="inventory-page">
      <Breadcrumb />
      <InventoryStats stats={stats} />

      <InventoryFilters
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        lowStockOnly={lowStockOnly}
        setLowStockOnly={setLowStockOnly}
      />

      <InventoryTable
        products={products}
        categories={categories}
        loading={loading}
      />

      <PaginationBar
        currentPage={currentPage}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setCurrentPage}
        resourceName="sản phẩm"
      />
    </div>
  );
}
