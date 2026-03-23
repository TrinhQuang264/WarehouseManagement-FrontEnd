import { Edit3, FileText, Plus, Printer } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../../../components/ui/Breadcrumbs.jsx';
import Button from '../../../components/ui/Button.jsx';
import ConfirmModal from '../../../components/ui/ConfirmModal.jsx';
import { useHeader } from '../../../contexts/HeaderContext.jsx';
import { COMMON_URLS, EXPORT_URLS } from '../../../constants/urls.js';
import { toast } from '../../../utils/toast.js';
import ExportFilters from '../components/ExportFilters.jsx';
import ExportPagination from '../components/ExportPagination.jsx';
import ExportReceiptDetail from '../components/ExportReceiptDetail.jsx';
import ExportReceiptForm from '../components/ExportReceiptForm.jsx';
import ExportStats from '../components/ExportStats.jsx';
import ExportTable from '../components/ExportTable.jsx';
import { useExports } from '../hooks/useExports.jsx';
import '../styles/Exports.css';

function getEditBasePath() {
  return EXPORT_URLS.edit('').replace(/\/$/, '');
}

function toDateInputValue(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function hydrateReceipt(receipt, products) {
  const items = (receipt.items || []).map((item, index) => {
    const product = products.find((productItem) => String(productItem.id) === String(item.productId));
    const quantity = Number(item.quantity) || 1;
    const unitPrice = Number(item.unitPrice ?? product?.price ?? 0);
    return { ...item, id: item.id || `${receipt.id || 'draft'}-${item.productId}-${index}`, productId: Number(item.productId), productName: product?.name || item.productName || 'Sản phẩm chưa xác định', imageUrl: product?.imageUrl || item.imageUrl || '', sku: product?.code || item.sku || 'N/A', unit: item.unit || 'Cái', description: product?.description || item.description || '', quantity, unitPrice, lineTotal: quantity * unitPrice };
  });
  const subTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  return { ...receipt, customerId: receipt.customerId ? String(receipt.customerId) : '', date: toDateInputValue(receipt.date), items, totalQuantity, subTotal, discountAmount: 0, totalAmount: subTotal };
}

export default function ExportsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { products, customers, paginatedReceipts, stats, getReceiptById, buildEmptyReceipt, deleteReceipt, setSearch, selectedCustomer, setSelectedCustomer, selectedStatus, setSelectedStatus, selectedDateRange, setSelectedDateRange, currentPage, setCurrentPage, totalCount, pageSize, totalPages } = useExports();
  const { setActionButton, setOnSearch, setTitle, setSubtitle, resetHeader } = useHeader();

  const isAddMode = location.pathname === EXPORT_URLS.new;
  const isEditMode = location.pathname.startsWith(getEditBasePath());
  const isDetailMode = location.pathname.startsWith(EXPORT_URLS.list) && !isAddMode && !isEditMode && location.pathname !== EXPORT_URLS.list;
  const isFormMode = isAddMode || isEditMode;
  const pageTitle = isEditMode ? 'Chỉnh sửa phiếu xuất' : isAddMode ? 'Tạo phiếu xuất mới' : isDetailMode ? 'Chi tiết phiếu xuất' : '';

  const sourceReceipt = useMemo(() => (params.id ? getReceiptById(params.id) : null), [params.id, getReceiptById]);
  const receiptPrintRef = useRef(null);
  const [formReceipt, setFormReceipt] = useState(() => hydrateReceipt(buildEmptyReceipt(), products));
  const [draftItem, setDraftItem] = useState(() => ({ productId: String(products[0]?.id || ''), quantity: 1, unitPrice: products[0]?.price || 0 }));
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, receipt: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaperView, setIsPaperView] = useState(true);

  useEffect(() => { if (isFormMode) { const baseReceipt = isEditMode && sourceReceipt ? sourceReceipt : buildEmptyReceipt(); setFormReceipt(hydrateReceipt(baseReceipt, products)); } }, [isFormMode, isEditMode, sourceReceipt, buildEmptyReceipt, products]);
  useEffect(() => { if (isFormMode && products.length > 0) { setDraftItem((prev) => ({ productId: prev.productId || String(products[0].id), quantity: prev.quantity || 1, unitPrice: prev.unitPrice || products[0].price || 0 })); } }, [isFormMode, products]);
  useEffect(() => { if (isDetailMode) { setIsPaperView(true); } }, [isDetailMode, params.id]);

  const handlePreviewPdf = useCallback(async () => {
    try {
      const { openReceiptPdf } = await import('../../../utils/receiptPdf.js');
      await openReceiptPdf({
        element: receiptPrintRef.current?.firstElementChild || receiptPrintRef.current,
        filename: sourceReceipt?.code || 'phieu-xuat',
        mode: 'view',
      });
    } catch (error) {
      console.error('[ExportsPage] Error previewing receipt PDF:', error);
      toast.error('Không thể mở file PDF của phiếu xuất.');
    }
  }, [sourceReceipt]);

  const handlePrintReceipt = useCallback(async () => {
    try {
      const { openReceiptPdf } = await import('../../../utils/receiptPdf.js');
      await openReceiptPdf({
        element: receiptPrintRef.current?.firstElementChild || receiptPrintRef.current,
        filename: `${sourceReceipt?.code || 'phieu-xuat'}-print`,
        mode: 'print',
      });
    } catch (error) {
      console.error('[ExportsPage] Error printing receipt PDF:', error);
      toast.error('Không thể in phiếu xuất.');
    }
  }, [sourceReceipt]);

  useEffect(() => {
    if (isDetailMode) {
      setActionButton({
        render: () => (
          <div className="imports-detail-actions">
            <Button variant="secondary" icon={<Edit3 size={18} />} onClick={() => navigate(EXPORT_URLS.edit(sourceReceipt.id))}>Chỉnh sửa</Button>
            <Button variant="secondary" icon={<FileText size={18} />} onClick={handlePreviewPdf}>Xem PDF</Button>
            <Button icon={<Printer size={18} />} onClick={handlePrintReceipt}>In</Button>
          </div>
        ),
      });
      setOnSearch(null);
      setTitle(pageTitle);
      setSubtitle('Xem lại chứng từ xuất kho và toàn bộ dòng hàng đã bàn giao cho khách hàng.');
    } else if (isFormMode) {
      setActionButton(null);
      setOnSearch(null);
      setTitle(pageTitle);
      setSubtitle('');
    } else {
      setActionButton({ label: 'Tạo phiếu xuất mới', icon: <Plus size={18} />, onClick: () => navigate(EXPORT_URLS.new), searchPlaceholder: 'Tìm kiếm phiếu xuất, khách hàng...', className: 'shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]' });
      setOnSearch(setSearch);
      setTitle('');
      setSubtitle('');
    }
    return () => resetHeader();
  }, [isFormMode, isDetailMode, pageTitle, setActionButton, setOnSearch, setTitle, setSubtitle, setSearch, navigate, resetHeader, sourceReceipt, handlePreviewPdf, handlePrintReceipt]);

  const openEdit = useCallback((receipt) => navigate(EXPORT_URLS.edit(receipt.id)), [navigate]);
  const openDetail = useCallback((receipt) => navigate(EXPORT_URLS.detail(receipt.id)), [navigate]);
  const closeForm = useCallback(() => navigate(EXPORT_URLS.list), [navigate]);
  const handleDeleteClick = useCallback((receipt) => { setDeleteConfirm({ isOpen: true, receipt }); }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteConfirm.receipt) return;
    setIsDeleting(true);
    try {
      deleteReceipt(deleteConfirm.receipt.id);
      setDeleteConfirm({ isOpen: false, receipt: null });
      toast.success(`Xóa phiếu xuất "${deleteConfirm.receipt.code}" thành công.`);
    } catch (error) {
      console.error('[ExportsPage] Error deleting receipt:', error);
      toast.error('Lỗi khi xóa phiếu xuất.');
    } finally {
      setIsDeleting(false);
    }
  }, [deleteConfirm.receipt, deleteReceipt]);

  const updateReceiptItems = useCallback((items) => {
    setFormReceipt((prev) => {
      const normalizedItems = items.map((item, index) => {
        const product = products.find((productItem) => String(productItem.id) === String(item.productId));
        const quantity = Math.max(1, Number(item.quantity) || 1);
        const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
        return { ...item, id: item.id || `draft-${item.productId}-${index}`, productId: Number(item.productId), productName: product?.name || item.productName || 'Sản phẩm chưa xác định', imageUrl: product?.imageUrl || item.imageUrl || '', sku: product?.code || item.sku || 'N/A', unit: item.unit || 'Cái', description: product?.description || item.description || '', quantity, unitPrice, lineTotal: quantity * unitPrice };
      });
      const subTotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
      const totalQuantity = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
      return { ...prev, items: normalizedItems, subTotal, discountAmount: 0, totalAmount: subTotal, totalQuantity };
    });
  }, [products]);

  const handleMetaChange = useCallback((field, value) => { setFormReceipt((prev) => ({ ...prev, [field]: value })); }, []);
  const handleDraftItemChange = useCallback((field, value) => {
    if (field === 'productId') {
      const product = products.find((item) => String(item.id) === String(value));
      setDraftItem((prev) => ({ ...prev, productId: String(value), unitPrice: product?.price || prev.unitPrice || 0 }));
      return;
    }
    setDraftItem((prev) => ({ ...prev, [field]: value }));
  }, [products]);
  const handleAddItem = useCallback(() => {
    const product = products.find((item) => String(item.id) === String(draftItem.productId));
    if (!product) { toast.error('Vui lòng chọn sản phẩm để thêm vào phiếu xuất.'); return; }
    const quantity = Math.max(1, Number(draftItem.quantity) || 1);
    const unitPrice = Math.max(0, Number(draftItem.unitPrice) || product.price || 0);
    updateReceiptItems([...formReceipt.items, { id: `draft-${product.id}-${Date.now()}`, productId: product.id, quantity, unitPrice }]);
  }, [draftItem, formReceipt.items, products, updateReceiptItems]);
  const handleIncreaseQty = useCallback((itemId) => { updateReceiptItems(formReceipt.items.map((item) => item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item)); }, [formReceipt.items, updateReceiptItems]);
  const handleDecreaseQty = useCallback((itemId) => { updateReceiptItems(formReceipt.items.map((item) => item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item)); }, [formReceipt.items, updateReceiptItems]);
  const handleRemoveItem = useCallback((itemId) => { updateReceiptItems(formReceipt.items.filter((item) => item.id !== itemId)); }, [formReceipt.items, updateReceiptItems]);
  const handleSaveDraft = useCallback(() => { toast.info('Đã lưu phiếu xuất ở trạng thái bản nháp.'); navigate(EXPORT_URLS.list); }, [navigate]);
  const handleSubmit = useCallback(() => { toast.success(isEditMode ? 'Cập nhật phiếu xuất thành công.' : 'Tạo phiếu xuất mới thành công.'); navigate(EXPORT_URLS.list); }, [isEditMode, navigate]);

  if (isDetailMode) {
    if (!sourceReceipt) {
      return <div className="imports-page"><div className="page-header"><Breadcrumbs items={[{ label: 'Trang chủ', path: COMMON_URLS.dashboard }, { label: 'Xuất kho', path: EXPORT_URLS.list }, { label: 'Không tìm thấy phiếu' }]} /></div><div className="imports-card p-8 text-center text-slate-500">Phiếu xuất không tồn tại hoặc đã bị xóa.</div></div>;
    }
    return (
      <div className="imports-page">
        <div className="page-header imports-detail-topbar">
          <Breadcrumbs items={[{ label: 'Trang chủ', path: COMMON_URLS.dashboard }, { label: 'Xuất kho', path: EXPORT_URLS.list }, { label: sourceReceipt.code }]} />
          <label className="imports-view-toggle">
            <span>Hiển thị phiếu</span>
            <button
              type="button"
              role="switch"
              aria-checked={isPaperView}
              className={`imports-view-toggle-switch ${isPaperView ? 'imports-view-toggle-switch-active' : ''}`}
              onClick={() => setIsPaperView((prev) => !prev)}
            >
              <span className="imports-view-toggle-thumb" />
            </button>
          </label>
        </div>
        <ExportReceiptDetail receipt={sourceReceipt} viewMode={isPaperView ? 'paper' : 'document'} paperRef={receiptPrintRef} />
      </div>
    );
  }

  if (isFormMode) {
    return <div className="imports-page"><div className="page-header"><Breadcrumbs items={[{ label: 'Trang chủ', path: COMMON_URLS.dashboard }, { label: 'Xuất kho', path: EXPORT_URLS.list }, { label: pageTitle }]} /></div><ExportReceiptForm mode={isEditMode ? 'edit' : 'create'} receipt={formReceipt} customers={customers} products={products} draftItem={draftItem} onMetaChange={handleMetaChange} onDraftItemChange={handleDraftItemChange} onAddItem={handleAddItem} onIncreaseQty={handleIncreaseQty} onDecreaseQty={handleDecreaseQty} onRemoveItem={handleRemoveItem} onSaveDraft={handleSaveDraft} onSubmit={handleSubmit} onCancel={closeForm} /></div>;
  }

  return (
    <div className="imports-page">
      <div className="page-header"><Breadcrumbs items={[{ label: 'Trang chủ', path: COMMON_URLS.dashboard }, { label: 'Xuất kho' }]} /></div>
      <ExportStats stats={stats} />
      <section className="imports-table-section"><ExportFilters customers={customers} selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} selectedDateRange={selectedDateRange} setSelectedDateRange={setSelectedDateRange} /><ExportTable receipts={paginatedReceipts} onEdit={openEdit} onViewDetail={openDetail} onDelete={handleDeleteClick} /></section>
      <ExportPagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageSize={pageSize} totalCount={totalCount} totalPages={totalPages} />
      <ConfirmModal isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ isOpen: false, receipt: null })} onConfirm={handleDeleteConfirm} title="Xác nhận xóa phiếu xuất" message={`Bạn có chắc chắn muốn xóa phiếu xuất "${deleteConfirm.receipt?.code}"? Hành động này không thể hoàn tác.`} confirmLabel="Xóa" loading={isDeleting} variant="danger" />
    </div>
  );
}
