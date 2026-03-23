import { formatCurrency, formatNumber } from '../../../utils/util.js';

function formatDateTime(value) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function ExportReceiptPaper({ receipt }) {
  return (
    <div className="imports-paper">
      <div className="imports-paper-topbar" />
      <div className="imports-paper-header">
        <div>
          <div className="imports-paper-brand">WareSmart Management</div>
        </div>
        <div className="imports-paper-title-wrap">
          <h2>Phiếu Xuất Kho</h2>
          {/* Badge đã được chuyển ra ngoài phiếu */}
        </div>
      </div>

      <div className="imports-paper-meta">
        <div className="imports-paper-meta-col">
          <div><span>Mã phiếu:</span><strong>{receipt.code}</strong></div>
          <div><span>Ngày xuất:</span><strong>{formatDateTime(receipt.date)}</strong></div>
          <div><span>Người lập phiếu:</span><strong>{receipt.operatorName}</strong></div>
        </div>
        <div className="imports-paper-meta-col">
          <div><span>Khách hàng:</span><strong>{receipt.customerName}</strong></div>
          <div><span>Kho xuất:</span><strong>{receipt.warehouse}</strong></div>
          <div><span>Tham chiếu đơn:</span><strong>{receipt.referenceCode || 'Không có'}</strong></div>
        </div>
      </div>

      <table className="imports-paper-table">
        <colgroup>
          <col className="imports-paper-col-index" />
          <col className="imports-paper-col-name" />
          <col className="imports-paper-col-unit" />
          <col className="imports-paper-col-qty" />
          <col className="imports-paper-col-price" />
          <col className="imports-paper-col-total" />
        </colgroup>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>ĐVT</th>
            <th className="text-right">Số lượng</th>
            <th className="text-right">Đơn giá</th>
            <th className="text-right">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items.map((item, index) => (
            <tr key={item.id || `${item.productId}-${index}`}>
              <td>{String(index + 1).padStart(2, '0')}</td>
              <td className="imports-paper-cell-name">{item.productName}</td>
              <td>{item.unit || 'Cái'}</td>
              <td className="text-right">{item.quantity}</td>
              <td className="text-right">{formatCurrency(item.unitPrice)}</td>
              <td className="text-right font-bold">{formatCurrency(item.lineTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="imports-paper-summary">
        <div><span>Tổng tiền hàng:</span><strong>{formatCurrency(receipt.subTotal)}</strong></div>
        <div><span>Chiết khấu:</span><strong>{formatCurrency(receipt.discountAmount || 0)}</strong></div>
        <div className="imports-paper-summary-total"><span>TỔNG CỘNG:</span><strong>{formatCurrency(receipt.totalAmount)}</strong></div>
      </div>

      <div className="imports-paper-signatures">
        <div>
          <span>Người lập phiếu</span>
          <strong>{receipt.operatorName}</strong>
        </div>
        <div>
          <span>Thủ kho</span>
          <strong>Đã kiểm tra</strong>
        </div>
        <div>
          <span>Khách hàng</span>
          <strong>{receipt.customerName}</strong>
        </div>
      </div>
    </div>
  );
}

function ExportReceiptDocumentView({ receipt }) {
  return (
    <div className="imports-document">
      <section className="imports-document-section">
        <div className="imports-document-grid">
          <div className="imports-document-field"><span>Ngày xuất</span><strong>{formatDateTime(receipt.date)}</strong></div>
          <div className="imports-document-field"><span>Trạng thái</span><strong>{receipt.statusLabel || 'Không xác định'}</strong></div>
          <div className="imports-document-field"><span>Khách hàng</span><strong>{receipt.customerName}</strong></div>
          <div className="imports-document-field"><span>Kho xuất</span><strong>{receipt.warehouse}</strong></div>
          <div className="imports-document-field"><span>Mã tham chiếu</span><strong>{receipt.referenceCode || 'Không có'}</strong></div>
          <div className="imports-document-field"><span>Người lập phiếu</span><strong>{receipt.operatorName}</strong></div>
          <div className="imports-document-field imports-document-field-full"><span>Ghi chú</span><strong>{receipt.note || 'Không có ghi chú.'}</strong></div>
        </div>
      </section>

      <section className="imports-document-section">
        <div className="imports-document-section-title">Danh sách hàng xuất</div>
        <div className="imports-document-table">
          <div className="imports-document-table-head">
            <span>Chi tiết sản phẩm</span>
            <span>Số lượng</span>
            <span>Đơn giá</span>
            <span>Thành tiền</span>
          </div>
          {receipt.items.map((item, index) => (
            <div className="imports-document-row" key={item.id || `${item.productId}-${index}`}>
              <div className="imports-document-item">
                <div className="imports-document-item-thumb">
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.productName} className="imports-document-item-image" /> : <span>{String(index + 1).padStart(2, '0')}</span>}
                </div>
                <div>
                  <p className="imports-document-item-name">{item.productName}</p>
                  <p className="imports-document-item-meta">SKU: {item.sku || 'N/A'}</p>
                  <p className="imports-document-item-meta">{item.description || 'Không có mô tả.'}</p>
                </div>
              </div>
              <strong>{formatNumber(item.quantity)}</strong>
              <strong>{formatCurrency(item.unitPrice)}</strong>
              <strong>{formatCurrency(item.lineTotal)}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="imports-document-summary">
        <div><span>Tổng số lượng</span><strong>{formatNumber(receipt.totalQuantity)}</strong></div>
        <div><span>Tổng tiền hàng</span><strong>{formatCurrency(receipt.subTotal)}</strong></div>
        <div><span>Chiết khấu</span><strong>{formatCurrency(receipt.discountAmount || 0)}</strong></div>
        <div className="imports-document-summary-total"><span>Tổng cộng</span><strong>{formatCurrency(receipt.totalAmount)}</strong></div>
      </section>
    </div>
  );
}

export default function ExportReceiptDetail({ receipt, viewMode = 'paper', paperRef = null }) {
  return (
    <div className="imports-detail-page">
      {viewMode === 'paper' ? (
        <div className="imports-paper-wrap">
          <div className="imports-paper-with-status">
            <div ref={paperRef}>
              <ExportReceiptPaper receipt={receipt} />
            </div>

            {/* Badge trạng thái nằm ngoài phiếu, bên phải */}
            <div className="imports-paper-status-aside">
              <span className="imports-paper-badge">
                {receipt.statusLabel || 'CHÍNH THỨC'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <ExportReceiptDocumentView receipt={receipt} />
          <div className="imports-print-source" aria-hidden="true">
            <div ref={paperRef}>
              <ExportReceiptPaper receipt={receipt} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}