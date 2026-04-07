import React, { useCallback, useEffect, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import PaginationBar from "../../../components/ui/PaginationBar";
import TrashBinDrawer from "../../../components/ui/TrashBinDrawer";
import SupplierTable from "../components/SupplierTable";
import SupplierModal from "../components/SupplierModal";
import SupplierDetailPage from "../components/SupplierDetailPage.jsx";
import { useSuppliers } from "../hooks/useSuppliers.jsx";
import { useHeader } from "../../../contexts/HeaderContext";
import suppliersService from "../api/suppliersService";
import {
  COMMON_URLS,
  IMPORT_URLS,
  SUPPLIER_URLS,
} from "../../../constants/urls.js";
import "../styles/Suppliers.css";

function buildSupplierHistory(supplierId) {
  const base = [
    {
      id: 1,
      code: "PN-2024-001",
      dateLabel: "14/03/2024",
      totalAmount: 45000000,
      status: "completed",
      statusLabel: "Hoàn thành",
    },
    {
      id: 2,
      code: "PN-2024-005",
      dateLabel: "10/03/2024",
      totalAmount: 120000000,
      status: "pending",
      statusLabel: "Chờ thanh toán",
    },
    {
      id: 3,
      code: "PN-2024-012",
      dateLabel: "02/03/2024",
      totalAmount: 12500000,
      status: "completed",
      statusLabel: "Hoàn thành",
    },
    {
      id: 4,
      code: "PN-2023-998",
      dateLabel: "25/02/2024",
      totalAmount: 88200000,
      status: "completed",
      statusLabel: "Hoàn thành",
    },
  ];
  return base.map((item, index) => ({
    ...item,
    id: `${supplierId}-${item.id}`,
    totalAmount: item.totalAmount + supplierId * 220000 * index,
    href: IMPORT_URLS.detail(index + 1),
  }));
}

export default function SuppliersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const {
    suppliers,
    allActiveSuppliers,
    loading,
    isSubmitting,
    isFirstFetch,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    pageSize,
    totalCount,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedSupplier,
    setSelectedSupplier,
    handleAddSupplier,
    handleUpdateSupplier,
    handleDeleteSupplier,
    openEditModal,
    openDeleteModal,
    isTrashOpen,
    setIsTrashOpen,
    refreshList,
  } = useSuppliers();

  const {
    setActionButton,
    setExtraActions,
    setOnSearch,
    setTitle,
    resetHeader,
  } = useHeader();
  const isDetailMode =
    location.pathname !== SUPPLIER_URLS.list && Boolean(params.id);
  const currentSupplier = useMemo(
    () =>
      allActiveSuppliers.find(
        (supplier) => String(supplier.id) === String(params.id),
      ) || null,
    [allActiveSuppliers, params.id],
  );
  const supplierHistory = useMemo(
    () => (currentSupplier ? buildSupplierHistory(currentSupplier.id) : []),
    [currentSupplier],
  );
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  }, [setIsModalOpen, setSelectedSupplier]);
  const openCreateModal = useCallback(() => {
    setSelectedSupplier(null);
    setIsModalOpen(true);
  }, [setIsModalOpen, setSelectedSupplier]);
  const closeTrash = useCallback(() => setIsTrashOpen(false), [setIsTrashOpen]);
  const openTrash = useCallback(() => setIsTrashOpen(true), [setIsTrashOpen]);
  const handleSaveSupplier = useCallback(
    (data) => {
      if (selectedSupplier) return handleUpdateSupplier(selectedSupplier.id, data);
      return handleAddSupplier(data);
    },
    [handleAddSupplier, handleUpdateSupplier, selectedSupplier],
  );
  const handleSaveDetailSupplier = useCallback(
    (data) => handleUpdateSupplier(selectedSupplier?.id, data),
    [handleUpdateSupplier, selectedSupplier],
  );
  const handleViewDetail = useCallback(
    (supplier) => navigate(SUPPLIER_URLS.detail(supplier.id)),
    [navigate],
  );

  useEffect(() => {
    if (isDetailMode) {
      setActionButton(null);
      setExtraActions([]);
      setOnSearch(null);
      setTitle(
        currentSupplier
          ? `Chi tiết nhà cung cấp: ${currentSupplier.supplierName}`
          : "Chi tiết nhà cung cấp",
      );
    } else {
      setActionButton({
        label: "Thêm nhà cung cấp",
        icon: <Plus size={18} />,
        onClick: () => {
          openCreateModal();
        },
        searchPlaceholder: "Tìm kiếm nhà cung cấp...",
        className: "shadow-lg shadow-primary/20",
      });
      setExtraActions([
        {
          label: "Thùng rác",
          icon: <Trash2 size={18} />,
          onClick: openTrash,
          className: "bg-red-500 text-red-600 hover:bg-red-300",
        },
      ]);
      setOnSearch(() => setSearch);
      setTitle("");
    }
    return () => resetHeader();
  }, [
    isDetailMode,
    currentSupplier,
    setActionButton,
    setExtraActions,
    setOnSearch,
    setTitle,
    resetHeader,
    setIsModalOpen,
    setIsTrashOpen,
    setSelectedSupplier,
    setSearch,
    openCreateModal,
    openTrash,
  ]);

  if (isFirstFetch && loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isDetailMode) {
    if (!currentSupplier) {
      return (
        <div className="suppliers-page">
          <div className="page-header">
            <nav className="flex text-sm text-slate-500 mb-2">
              <Link
                to={COMMON_URLS.dashboard}
                className="hover:text-primary transition-colors"
              >
                Trang chủ
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <Link
                to={SUPPLIER_URLS.list}
                className="hover:text-primary transition-colors"
              >
                Nhà cung cấp
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-900 dark:text-white font-medium">
                Không tìm thấy
              </span>
            </nav>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Nhà cung cấp không tồn tại hoặc đã bị xóa.
          </div>
        </div>
      );
    }

    return (
      <>
        <SupplierDetailPage
          supplier={currentSupplier}
          history={supplierHistory}
          onEdit={openEditModal}
        />
        <SupplierModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveDetailSupplier}
          editingSupplier={selectedSupplier}
        />
      </>
    );
  }

  return (
    <>
      <div className="suppliers-page">
        <div className="page-header">
          <Breadcrumbs />
        </div>

        <SupplierTable
          suppliers={suppliers}
          loading={loading}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onViewDetail={handleViewDetail}
        />

        <PaginationBar
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          resourceName="nhà cung cấp"
        />

        <SupplierModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveSupplier}
          editingSupplier={selectedSupplier}
        />

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteSupplier}
          title="Xác nhận xóa nhà cung cấp"
          message={`Bạn có chắc chắn muốn xóa nhà cung cấp "${selectedSupplier?.supplierName}"? Dữ liệu sẽ được chuyển vào thùng rác.`}
          confirmText="Xác nhận xóa"
          variant="danger"
          loading={isSubmitting}
        />
      </div>

      <TrashBinDrawer
        isOpen={isTrashOpen}
        onClose={closeTrash}
        title="Thùng rác nhà cung cấp"
        service={suppliersService}
        onDataChange={refreshList}
        columns={[{ key: "supplierName" }]}
      />
    </>
  );
}
