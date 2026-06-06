import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHeader } from "../../../contexts/HeaderContext";
import ConfirmModal from "../../../components/ui/ConfirmModal.jsx";
import PaginationBar from "../../../components/ui/PaginationBar.jsx";
import ApproveTable from "../components/ApproveTable.jsx";
import { useApprove } from "../hooks/useApprove.jsx";
import Breadcrumbs from "../../../components/ui/Breadcrumbs";
import "../styles/Approve.css";

export default function ApprovePage() {
  const navigate = useNavigate();
  const {
    receipts,
    allCount,
    loading,
    search,
    setSearch,
    selectedType,
    setSelectedType,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    handleApprove,
    handleCancel,
  } = useApprove();

  const { setActionButton, setOnSearch, setTitle, setSubtitle, resetHeader } =
    useHeader();

  // Dialog state
  const [approveConfirm, setApproveConfirm] = useState({
    isOpen: false,
    receipt: null,
  });
  const [cancelConfirm, setCancelConfirm] = useState({
    isOpen: false,
    receipt: null,
  });
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setActionButton(null);
    setOnSearch(() => setSearch);

    return () => resetHeader();
  }, [setActionButton, setOnSearch, setSearch, resetHeader]);

  const handleOpenApproveModal = useCallback((receipt) => {
    setApproveConfirm({ isOpen: true, receipt });
  }, []);

  const handleOpenCancelModal = useCallback((receipt) => {
    setCancelConfirm({ isOpen: true, receipt });
    setCancelReason("");
  }, []);

  const handleApproveConfirm = useCallback(async () => {
    if (!approveConfirm.receipt) return;
    setIsSubmitting(true);
    const success = await handleApprove(approveConfirm.receipt.id);
    setIsSubmitting(false);
    if (success) {
      setApproveConfirm({ isOpen: false, receipt: null });
    }
  }, [approveConfirm.receipt, handleApprove]);

  const handleCancelConfirm = useCallback(async () => {
    if (!cancelConfirm.receipt) return;
    setIsSubmitting(true);
    const success = await handleCancel(cancelConfirm.receipt.id, cancelReason);
    setIsSubmitting(false);
    if (success) {
      setCancelConfirm({ isOpen: false, receipt: null });
    }
  }, [cancelConfirm.receipt, cancelReason, handleCancel]);

  const handleViewDetail = useCallback(
    (receipt) => {
      if (receipt.type === 2) {
        navigate(`/export/${receipt.id}`);
      } else {
        navigate(`/import/${receipt.id}`);
      }
    },
    [navigate],
  );

  return (
    <div className="approve-page">
      <section className="imports-table-section">
        <div className="mb-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="page-header">
            <Breadcrumbs />
          </div>
          <select
            className="border border-slate-200 rounded px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="import">Phiếu nhập</option>
            <option value="export">Phiếu xuất</option>
          </select>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-[250px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ApproveTable
            receipts={receipts}
            onApprove={handleOpenApproveModal}
            onCancel={handleOpenCancelModal}
            onViewDetail={handleViewDetail}
          />
        )}
      </section>

      <PaginationBar
        currentPage={currentPage}
        pageSize={pageSize}
        totalCount={allCount}
        onPageChange={setCurrentPage}
        resourceName="phiếu chờ duyệt"
      />

      {/* Confirm Approve Modal */}
      <ConfirmModal
        isOpen={approveConfirm.isOpen}
        onClose={() => setApproveConfirm({ isOpen: false, receipt: null })}
        onConfirm={handleApproveConfirm}
        title="Xác nhận duyệt phiếu kho"
        message={`Bạn có chắc chắn muốn duyệt phiếu "${approveConfirm.receipt?.receiptCode}"? Sau khi duyệt, số lượng tồn kho của các sản phẩm trong phiếu sẽ được thay đổi.`}
        confirmLabel="Duyệt phiếu"
        loading={isSubmitting}
        variant="success"
      />

      {/* Confirm Cancel Modal */}
      <ConfirmModal
        isOpen={cancelConfirm.isOpen}
        onClose={() => setCancelConfirm({ isOpen: false, receipt: null })}
        onConfirm={handleCancelConfirm}
        title="Xác nhận hủy phiếu kho"
        message={
          <div className="flex flex-col gap-3">
            <p>{`Bạn có chắc chắn muốn hủy bỏ phiếu "${cancelConfirm.receipt?.receiptCode}"? Hành động này sẽ đánh dấu phiếu bị hủy và không thể khôi phục.`}</p>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">
                Lý do hủy phiếu:
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do hủy..."
                className="w-full border border-slate-200 rounded p-2 text-sm focus:outline-none focus:border-primary"
                rows={3}
              />
            </div>
          </div>
        }
        confirmLabel="Hủy phiếu"
        loading={isSubmitting}
        variant="danger"
      />
    </div>
  );
}
