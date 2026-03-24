import { CalendarDays, FileText, PackageMinus, Save, Search, Trash2, UserRound, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Button from '../../../components/ui/Button.jsx';
import DataTableCard from '../../../components/ui/DataTableCard.jsx';
import { formatCurrency } from '../../../utils/util.js';

function ReceiptSummary({ receipt }) {
  return (
    <div className="imports-summary-card">
      <h3 className="imports-summary-title">Tổng kết phiếu</h3>
      <div className="imports-summary-list">
        <div className="imports-summary-row"><span>Tổng số mặt hàng:</span><strong>{receipt.items.length}</strong></div>
        <div className="imports-summary-row"><span>Tổng số lượng:</span><strong>{receipt.totalQuantity}</strong></div>
        <div className="imports-summary-block">
          <div className="imports-summary-row"><span>Tổng tiền hàng:</span><strong>{formatCurrency(receipt.subTotal)}</strong></div>
          <div className="imports-summary-row"><span>Chiết khấu:</span><strong>{formatCurrency(receipt.discountAmount || 0)}</strong></div>
        </div>
        <div className="imports-summary-total"><span>TỔNG CỘNG</span><strong>{formatCurrency(receipt.totalAmount)}</strong></div>
      </div>
    </div>
  );
}

export default function ExportReceiptForm({ mode, receipt, customers, products, draftItem, onMetaChange, onDraftItemChange, onAddItem, onIncreaseQty, onDecreaseQty, onRemoveItem, onSaveDraft, onSubmit, onCancel }) {
  const selectedProduct = useMemo(() => products.find((product) => String(product.id) === String(draftItem.productId)) || null, [products, draftItem.productId]);
  const [productSearch, setProductSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setProductSearch(selectedProduct?.name || '');
  }, [selectedProduct]);

  const searchResults = useMemo(() => {
    const keyword = String(productSearch ?? '').trim().toLowerCase();
    if (!keyword) return products.slice(0, 6);
    return products.filter((product) => [product.name, product.code, product.description].some((value) => String(value ?? '').toLowerCase().includes(keyword))).slice(0, 6);
  }, [products, productSearch]);

  const handleSelectProduct = (product) => {
    onDraftItemChange('productId', String(product.id));
    setProductSearch(product.name);
    setIsSearchOpen(false);
  };

  return (
    <div className="imports-form-page">
      <div className="imports-form-grid">
        <div className="imports-form-main">
          <div className="imports-card">
            <div className="imports-card-header"><div className="imports-card-heading"><FileText size={18} className="text-primary" /><h2>Thông tin chung</h2></div></div>
            <div className="imports-meta-grid">
              <label className="imports-field">
                <span>Khách hàng</span>
                <div className="imports-input-with-icon">
                  <UserRound size={18} />
                  <select className="imports-input imports-input-icon" value={receipt.customerId} onChange={(event) => onMetaChange('customerId', event.target.value)}>
                    <option value="">Chọn khách hàng...</option>
                    {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.fullName}</option>)}
                  </select>
                </div>
              </label>
              <label className="imports-field">
                <span>Ngày xuất</span>
                <div className="imports-input-with-icon"><CalendarDays size={18} /><input type="date" className="imports-input imports-input-icon" value={receipt.date} onChange={(event) => onMetaChange('date', event.target.value)} /></div>
              </label>
              <label className="imports-field"><span>Mã tham chiếu</span><input type="text" className="imports-input" value={receipt.referenceCode} onChange={(event) => onMetaChange('referenceCode', event.target.value)} placeholder="VD: SO-202603-9001" /></label>
              <label className="imports-field imports-field-full"><span>Ghi chú</span><div className="imports-input-with-icon"><FileText size={18} /><input type="text" className="imports-input imports-input-icon" value={receipt.note} onChange={(event) => onMetaChange('note', event.target.value)} placeholder="Nhập ghi chú thêm..." /></div></label>
            </div>
          </div>

          <div className="imports-card">
            <div className="imports-card-header"><div className="imports-card-heading"><PackageMinus size={18} className="text-primary" /><h2>Chọn sản phẩm xuất</h2></div></div>
            <div className="imports-entry-grid">
              <label className="imports-field imports-entry-product">
                <span>Sản phẩm</span>
                <div className="imports-product-search-box">
                  <div className="imports-search-input-wrap"><Search size={18} className="imports-search-icon" /><input type="text" className="imports-input imports-search-input" value={productSearch} onChange={(event) => { setProductSearch(event.target.value); setIsSearchOpen(true); }} onFocus={() => setIsSearchOpen(true)} placeholder="Tìm tên sản phẩm hoặc mã SKU..." /></div>
                  {isSearchOpen && searchResults.length > 0 && (
                    <div className="imports-search-results imports-product-search-results">
                      {searchResults.map((product) => (
                        <button key={product.id} type="button" className="imports-search-result" onMouseDown={(event) => event.preventDefault()} onClick={() => handleSelectProduct(product)}>
                          <div className="imports-search-result-thumb">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" /> : null}</div>
                          <div className="imports-search-result-content"><p>{product.name}</p><span>{product.code} • Tồn kho: {product.quantity ?? 0}</span></div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>
              <label className="imports-field"><span>Số lượng</span><input type="number" min="1" className="imports-input" value={draftItem.quantity} onChange={(event) => onDraftItemChange('quantity', event.target.value)} /></label>
              <label className="imports-field imports-entry-price"><span>Đơn giá (VNĐ)</span><input type="number" min="0" className="imports-input imports-input-right" value={draftItem.unitPrice} onChange={(event) => onDraftItemChange('unitPrice', event.target.value)} /></label>
              <div className="imports-entry-action"><Button variant="secondary" className="w-full justify-center border-primary/20 text-primary hover:bg-primary hover:text-white" onClick={onAddItem}>Thêm</Button></div>
            </div>
          </div>

          <DataTableCard>
            <div className="table-wrapper">
              <table className="table">
                <thead><tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700"><th className="table-th px-6">STT</th><th className="table-th px-6">Sản phẩm</th><th className="table-th px-6">Mã SKU</th><th className="table-th px-6 text-center">Số lượng</th><th className="table-th px-6 text-right">Đơn giá</th><th className="table-th px-6 text-right">Thành tiền</th><th className="table-th px-6 text-center">Thao tác</th></tr></thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {receipt.items.map((item, index) => (
                    <tr key={item.id || `${item.productId}-${index}`} className="table-row-hover">
                      <td className="px-6 py-4 text-sm text-slate-500">{String(index + 1).padStart(2, '0')}</td>
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="imports-product-thumb">{item.imageUrl ? <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" /> : null}</div><div><p className="text-sm font-semibold text-slate-900 dark:text-white">{item.productName}</p><p className="text-xs text-slate-500">{item.description || 'Sản phẩm kho'}</p></div></div></td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-500 uppercase">{item.sku}</td>
                      <td className="px-6 py-4 text-center"><div className="imports-qty-stepper"><button type="button" onClick={() => onDecreaseQty(item.id)}>-</button><span>{item.quantity}</span><button type="button" onClick={() => onIncreaseQty(item.id)}>+</button></div></td>
                      <td className="px-6 py-4 text-right text-sm">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(item.lineTotal)}</td>
                      <td className="px-6 py-4 text-center"><button type="button" onClick={() => onRemoveItem(item.id)} className="imports-danger-btn"><Trash2 size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DataTableCard>
        </div>

        <div className="imports-form-side">
          <ReceiptSummary receipt={receipt} />
          <div className="imports-side-actions">
            <Button 
              className="w-full justify-center py-3" 
              onClick={onSubmit}>{mode === 'edit' ? 'Cập nhật phiếu xuất' : 'Xác nhận xuất kho'}
            </Button>
            <button type="button" className="imports-cancel-link" onClick={onCancel}>
              <X size={16} /> Hủy bỏ phiếu này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
