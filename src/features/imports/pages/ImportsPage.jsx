import { Edit3, FileText, Plus, Printer } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../../../components/ui/Breadcrumbs.jsx';
import Button from '../../../components/ui/Button.jsx';
import ConfirmModal from '../../../components/ui/ConfirmModal.jsx';
import { useHeader } from '../../../contexts/HeaderContext.jsx';
import { COMMON_URLS, IMPORT_URLS } from '../../../constants/urls.js';
import { toast } from '../../../utils/toast.js';
import ImportFilters from '../components/ImportFilters.jsx';
import ImportPagination from '../components/ImportPagination.jsx';
import ImportReceiptDetail from '../components/ImportReceiptDetail.jsx';
import ImportReceiptForm from '../components/ImportReceiptForm.jsx';
import ImportStats from '../components/ImportStats.jsx';
import ImportTable from '../components/ImportTable.jsx';
import { useImports } from '../hooks/useImports.jsx';
import '../styles/Imports.css';

function getEditBasePath() {
  return IMPORT_URLS.edit('').replace(/\/$/, '');
}

function toDateInputValue(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function hydrateReceipt(receipt, products) {
  const items = (receipt.items || []).map((item, index) => {
    const product = products.find((productItem) => String(productItem.id) === String(item.productId));
    const quantity = Number(item.quantity) || 1;
    const unitPrice = Number(item.unitPrice ?? product?.importPrice ?? 0);

    return {
      ...item,
      id: item.id || `${receipt.id || 'draft'}-${item.productId}-${index}`,
      productId: Number(item.productId),
      productName: product?.name || item.productName || 'Sản phẩm chưa xác định',
      imageUrl: product?.imageUrl || item.imageUrl || '',
      sku: product?.code || item.sku || 'N/A',
      unit: item.unit || 'Cái',
      description: product?.description || item.description || '',
      quantity,
      unitPrice,
      lineTotal: quantity * unitPrice,
    };
  });

  const subTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    ...receipt,
    supplierId: receipt.supplierId ? String(receipt.supplierId) : '',
    date: toDateInputValue(receipt.date),
    items,
    totalQuantity,
    subTotal,
    vatAmount: 0,
    totalAmount: subTotal,
  };
}

export default function ImportsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const {
    products,
    suppliers,
    paginatedReceipts,
    stats,
    getReceiptById,
    buildEmptyReceipt,
    deleteReceipt,
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
  } = useImports();

  const { setActionButton, setOnSearch, setTitle, setSubtitle, resetHeader } = useHeader();

  const isAddMode = location.pathname === IMPORT_URLS.new;
  const isEditMode = location.pathname.startsWith(getEditBasePath());
  const isDetailMode = location.pathname.startsWith(IMPORT_URLS.list) && !isAddMode && !isEditMode && location.pathname !== IMPORT_URLS.list;
  const isFormMode = isAddMode || isEditMode;
  const pageTitle = isEditMode ? 'Chỉnh sửa phiếu nhập' : isAddMode ? 'Tạo phiếu nhập mới' : isDetailMode ? 'Chi tiết phiếu nhập' : '';

  const sourceReceipt = useMemo(() => (params.id ? getReceiptById(params.id) : null), [params.id, getReceiptById]);
  const receiptPrintRef = useRef(null);

  const [formReceipt, setFormReceipt] = useState(() => hydrateReceipt(buildEmptyReceipt(), products));
  const [draftItem, setDraftItem] = useState(() => ({
    productId: String(products[0]?.id || ''),
    quantity: 1,
    unitPrice: products[0]?.importPrice || 0,
  }));
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, receipt: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaperView, setIsPaperView] = useState(true);

  useEffect(() => {
    if (isFormMode) {
      const baseReceipt = isEditMode && sourceReceipt ? sourceReceipt : buildEmptyReceipt();
      setFormReceipt(hydrateReceipt(baseReceipt, products));
    }
  }, [isFormMode, isEditMode, sourceReceipt, buildEmptyReceipt, products]);

  useEffect(() => {
    if (isFormMode && products.length > 0) {
      setDraftItem((prev) => ({
        productId: prev.productId || String(products[0].id),
        quantity: prev.quantity || 1,
        unitPrice: prev.unitPrice || products[0].importPrice || 0,
      }));
    }
  }, [isFormMode, products]);

  useEffect(() => {
    if (isDetailMode) {
      setIsPaperView(true);
    }
  }, [isDetailMode, params.id]);

  const handlePreviewPdf = useCallback(async () => {
    try {
      const { openReceiptPdf } = await import('../../../utils/receiptPdf.js');
      await openReceiptPdf({
        element: receiptPrintRef.current?.firstElementChild || receiptPrintRef.current,
        filename: sourceReceipt?.code || 'phieu-nhap',
        mode: 'view',
      });
    } catch (error) {
      console.error('[ImportsPage] Error previewing receipt PDF:', error);
      toast.error('Không thể mở file PDF của phiếu nhập.');
    }
  }, [sourceReceipt]);

  const handlePrintReceipt = useCallback(async () => {
    try {
      const { openReceiptPdf } = await import('../../../utils/receiptPdf.js');
      await openReceiptPdf({
        element: receiptPrintRef.current?.firstElementChild || receiptPrintRef.current,
        filename: `${sourceReceipt?.code || 'phieu-nhap'}-print`,
        mode: 'print',
      });
    } catch (error) {
      console.error('[ImportsPage] Error printing receipt PDF:', error);
      toast.error('Không thể in phiếu nhập.');
    }
  }, [sourceReceipt]);

  useEffect(() => {
    if (isDetailMode) {
      setActionButton({
        render: () => (
          <div className="imports-detail-actions">
            <Button variant="secondary" icon={<Edit3 size={18} />} onClick={() => navigate(IMPORT_URLS.edit(sourceReceipt.id))}>Chỉnh sửa</Button>
            <Button variant="secondary" icon={<FileText size={18} />} onClick={handlePreviewPdf}>Xem PDF</Button>
            <Button icon={<Printer size={18} />} onClick={handlePrintReceipt}>In</Button>
          </div>
        ),
      });
      setOnSearch(null);
      setTitle(pageTitle);
      setSubtitle('Xem lại chứng từ nhập kho và toàn bộ dòng hàng đã ghi nhận trên hệ thống.');
    } else if (isFormMode) {
      setActionButton(null);
      setOnSearch(null);
      setTitle(pageTitle);
      setSubtitle('');
    } else {
      setActionButton({
        label: 'Tạo phiếu nhập mới',
        icon: <Plus size={18} />,
        onClick: () => navigate(IMPORT_URLS.new),
        searchPlaceholder: 'Tìm kiếm phiếu nhập, nhà cung cấp...',
        className: 'shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]',
      });
      setOnSearch(setSearch);
      setTitle('');
      setSubtitle('');
    }

    return () => resetHeader();
  }, [isFormMode, isDetailMode, pageTitle, setActionButton, setOnSearch, setTitle, setSubtitle, setSearch, navigate, resetHeader, sourceReceipt, handlePreviewPdf, handlePrintReceipt]);

  const openEdit = useCallback((receipt) => navigate(IMPORT_URLS.edit(receipt.id)), [navigate]);
  const openDetail = useCallback((receipt) => navigate(IMPORT_URLS.detail(receipt.id)), [navigate]);
  const closeForm = useCallback(() => navigate(IMPORT_URLS.list), [navigate]);

  const handleDeleteClick = useCallback((receipt) => {
    setDeleteConfirm({ isOpen: true, receipt });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteConfirm.receipt) return;

    setIsDeleting(true);
    try {
      deleteReceipt(deleteConfirm.receipt.id);
      setDeleteConfirm({ isOpen: false, receipt: null });
      toast.success(`Xóa phiếu nhập "${deleteConfirm.receipt.code}" thành công.`);
    } catch (error) {
      console.error('[ImportsPage] Error deleting receipt:', error);
      toast.error('Lỗi khi xóa phiếu nhập.');
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
        return {
          ...item,
          id: item.id || `draft-${item.productId}-${index}`,
          productId: Number(item.productId),
          productName: product?.name || item.productName || 'Sản phẩm chưa xác định',
          imageUrl: product?.imageUrl || item.imageUrl || '',
          sku: product?.code || item.sku || 'N/A',
          unit: item.unit || 'Cái',
          description: product?.description || item.description || '',
          quantity,
          unitPrice,
          lineTotal: quantity * unitPrice,
        };
      });
      const subTotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
      const totalQuantity = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
      return { ...prev, items: normalizedItems, subTotal, vatAmount: 0, totalAmount: subTotal, totalQuantity };
    });
  }, [products]);

  const handleMetaChange = useCallback((field, value) => {
    setFormReceipt((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleDraftItemChange = useCallback((field, value) => {
    if (field === 'productId') {
      const product = products.find((item) => String(item.id) === String(value));
      setDraftItem((prev) => ({
        ...prev,
        productId: String(value),
        unitPrice: product?.importPrice || prev.unitPrice || 0,
      }));
      return;
    }

    setDraftItem((prev) => ({ ...prev, [field]: value }));
  }, [products]);

  const handleAddItem = useCallback(() => {
    const product = products.find((item) => String(item.id) === String(draftItem.productId));
    if (!product) {
      toast.error('Vui lòng chọn sản phẩm để thêm vào phiếu nhập.');
      return;
    }

    const quantity = Math.max(1, Number(draftItem.quantity) || 1);
    const unitPrice = Math.max(0, Number(draftItem.unitPrice) || product.importPrice || 0);

    updateReceiptItems([
      ...formReceipt.items,
      {
        id: `draft-${product.id}-${Date.now()}`,
        productId: product.id,
        quantity,
        unitPrice,
      },
    ]);
  }, [draftItem, formReceipt.items, products, updateReceiptItems]);

  const handleIncreaseQty = useCallback((itemId) => {
    updateReceiptItems(formReceipt.items.map((item) => item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item));
  }, [formReceipt.items, updateReceiptItems]);

  const handleDecreaseQty = useCallback((itemId) => {
    updateReceiptItems(formReceipt.items.map((item) => item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item));
  }, [formReceipt.items, updateReceiptItems]);

  const handleRemoveItem = useCallback((itemId) => {
    updateReceiptItems(formReceipt.items.filter((item) => item.id !== itemId));
  }, [formReceipt.items, updateReceiptItems]);

  const handleSaveDraft = useCallback(() => {
    toast.info('Đã lưu phiếu nhập ở trạng thái bản nháp.');
    navigate(IMPORT_URLS.list);
  }, [navigate]);

  const handleSubmit = useCallback(() => {
    toast.success(isEditMode ? 'Cập nhật phiếu nhập thành công.' : 'Tạo phiếu nhập mới thành công.');
    navigate(IMPORT_URLS.list);
  }, [isEditMode, navigate]);

  if (isDetailMode) {
    if (!sourceReceipt) {
      return (
        <div className="imports-page">
          <div className="page-header">
            <Breadcrumbs items={[{ label: 'Trang chủ', path: COMMON_URLS.dashboard }, { label: 'Nhập kho', path: IMPORT_URLS.list }, { label: 'Không tìm thấy phiếu' }]} />
          </div>
          <div className="imports-card p-8 text-center text-slate-500">Phiếu nhập không tồn tại hoặc đã bị xóa.</div>
        </div>
      );
    }

    return (
      <div className="imports-page">
        <div className="page-header imports-detail-topbar">
          <Breadcrumbs items={[{ label: 'Trang chủ', path: COMMON_URLS.dashboard }, { label: 'Nhập kho', path: IMPORT_URLS.list }, { label: sourceReceipt.code }]} />
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
        <ImportReceiptDetail receipt={sourceReceipt} viewMode={isPaperView ? 'paper' : 'document'} paperRef={receiptPrintRef} />
      </div>
    );
  }

  if (isFormMode) {
    return (
      <div className="imports-page">
        <div className="page-header">
          <Breadcrumbs items={[{ label: 'Trang chủ', path: COMMON_URLS.dashboard }, { label: 'Nhập kho', path: IMPORT_URLS.list }, { label: pageTitle }]} />
        </div>
        <ImportReceiptForm
          mode={isEditMode ? 'edit' : 'create'}
          receipt={formReceipt}
          suppliers={suppliers}
          products={products}
          draftItem={draftItem}
          setDraftItem={setDraftItem}
          onMetaChange={handleMetaChange}
          onDraftItemChange={handleDraftItemChange}
          onAddItem={handleAddItem}
          onIncreaseQty={handleIncreaseQty}
          onDecreaseQty={handleDecreaseQty}
          onRemoveItem={handleRemoveItem}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </div>
    );
  }

  return (
    <div className="imports-page">
      <div className="page-header">
        <Breadcrumbs items={[{ label: 'Trang chủ', path: COMMON_URLS.dashboard }, { label: 'Nhập kho' }]} />
      </div>

      <ImportStats stats={stats} />

      <section className="imports-table-section">
        <ImportFilters
          suppliers={suppliers}
          selectedSupplier={selectedSupplier}
          setSelectedSupplier={setSelectedSupplier}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
        />
        <ImportTable receipts={paginatedReceipts} onEdit={openEdit} onViewDetail={openDetail} onDelete={handleDeleteClick} />
      </section>

      <ImportPagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageSize={pageSize} totalCount={totalCount} totalPages={totalPages} />

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, receipt: null })}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa phiếu nhập"
        message={`Bạn có chắc chắn muốn xóa phiếu nhập "${deleteConfirm.receipt?.code}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        loading={isDeleting}
        variant="danger"
      />
    </div>
  );
}
