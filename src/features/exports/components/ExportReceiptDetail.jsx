import { formatCurrency, formatNumber } from "../../../utils/util.js";

function formatDateTime(value) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
        </div>
      </div>

      <div className="imports-paper-meta flex w-full">
        <div className="imports-paper-meta-col w-[250px] shrink-0">
          <div>
            <span>Mã phiếu:</span>
            <strong>{receipt.receiptCode}</strong>
          </div>

          <div>
            <span>Tham chiếu đơn:</span>
            <strong>{receipt.referenceCode}</strong>
          </div>

          <div>
            <span>Người lập phiếu:</span>
            <strong>{receipt.createdByName}</strong>
          </div>
        </div>

        <div className="imports-paper-meta-col flex-1">
          <div>
            <span>Khách hàng:</span>
            <strong>{receipt.customerName}</strong>
          </div>

          <div>
            <span>Ngày tạo phiếu:</span>
            <strong>{formatDateTime(receipt.date)}</strong>
          </div>
          <div>
            <span>
              {receipt.approvedDate
                ? "Ngày duyệt phiếu"
                : receipt.canceledDate
                  ? "Ngày hủy phiếu"
                  : ""}
            </span>
            <strong>
              {formatDateTime(receipt.approvedDate ?? receipt.canceledDate)}
            </strong>
          </div>
        </div>
      </div>

      <table className="imports-paper-table">
        <colgroup>
          <col className="imports-paper-col-index" />
          <col className="imports-paper-col-name" />
          <col className="imports-paper-col-qty" />
          <col className="imports-paper-col-price" />
          <col className="imports-paper-col-total" />
        </colgroup>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th className="text-right">Số lượng</th>
            <th className="text-right">Đơn giá</th>
            <th className="text-right">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items.map((item, index) => (
            <tr key={item.id || `${item.productId}-${index}`}>
              <td>{String(index + 1).padStart(2, "0")}</td>
              <td className="imports-paper-cell-name">{item.productName}</td>
              <td className="">{item.quantity}</td>
              <td className="">{formatCurrency(item.unitCost)}</td>
              <td className=" font-bold">{formatCurrency(item.lineTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: receipt.isCanceled ? "1fr 22rem" : "1fr",
          gap: "2rem",
          alignItems: "start",
          color: "black",
        }}
      >
        {receipt.isCanceled && (
          <div style={{ color: "red" }}>
            <span>Lý do hủy: </span>
            <span>{receipt.noteCancel}</span>
          </div>
        )}
        <div
          className="imports-paper-summary"
          style={receipt.isCanceled ? { margin: 0, maxWidth: "100%" } : {}}
        >
          <div className="imports-paper-summary-total">
            <span>Tổng tiền hàng:</span>
            <strong>{formatCurrency(receipt.totalAmount)}</strong>
          </div>
        </div>
      </div>

      <div className="imports-paper-signatures">
        <div>
          <span>Người lập phiếu</span>
          <strong>{receipt.createdByName}</strong>
        </div>
        <div>
          <span>
            {receipt.approvedByName
              ? "Người duyệt phiếu"
              : receipt.canceledByName
                ? "Người hủy phiếu"
                : ""}
          </span>

          <strong>{receipt.approvedByName ?? receipt.canceledByName}</strong>
        </div>
        <div>
          <span>Khách hàng</span>
          <strong>{receipt.customerName}</strong>
        </div>
      </div>
    </div>
  );
}

function ExportReceiptDocumentView({ receipt, showStatus }) {
  return (
    <div className="imports-document">
      <section className="imports-document-section">
        <div className="imports-document-grid">
          <div className="imports-document-field">
            <span>Mã phiếu</span>
            <strong>{receipt.receiptCode}</strong>
          </div>
          <div className="imports-document-field">
            <span>Tham chiếu đơn</span>
            <strong>{receipt.referenceCode}</strong>
          </div>
          <div className="imports-document-field">
            <span>Khách hàng</span>
            <strong>{receipt.customerName}</strong>
          </div>
          {showStatus && (
            <div className="imports-document-field">
              <span>Trạng thái</span>
              <strong>{receipt.statusLabel}</strong>
            </div>
          )}
          <div className="imports-document-field">
            <span>Người lập phiếu</span>
            <strong>{receipt.createdByName}</strong>
          </div>
          <div className="imports-document-field">
            <span>Ngày tạo phiếu</span>
            <strong>{formatDateTime(receipt.createDate)}</strong>
          </div>
          <div className="imports-document-field">
            <span>
              {receipt.approvedByName
                ? "Người duyệt phiếu"
                : receipt.canceledByName
                  ? "Người hủy phiếu"
                  : ""}
            </span>
            <strong>{receipt.approvedByName ?? receipt.canceledByName}</strong>
          </div>
          <div className="imports-document-field">
            <span>
              {receipt.approvedDate
                ? "Ngày duyệt phiếu"
                : receipt.canceledDate
                  ? "Ngày hủy phiếu"
                  : ""}
            </span>
            <strong>
              {formatDateTime(receipt.approvedDate ?? receipt.canceledDate)}
            </strong>
          </div>
          <div className="imports-document-field">
            <span>Ghi chú</span>
            <strong>{receipt.note || "Không có ghi chú."}</strong>
          </div>
          <div className="imports-document-field">
            {receipt.isCanceled && (
              <div className="text-red-900">
                <span>Lý do hủy: </span>
                <strong>{receipt.noteCancel || "Không có ghi chú."}</strong>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="imports-document-section">
        <div className="imports-document-section-title">
          Danh sách hàng xuất
        </div>
        <div className="imports-document-table">
          <div className="imports-document-table-head">
            <span>Chi tiết sản phẩm</span>
            <span>Số lượng</span>
            <span>Đơn giá</span>
            <span>Thành tiền</span>
          </div>
          {receipt.items.map((item, index) => (
            <div
              className="imports-document-row"
              key={item.id || `${item.productId}-${index}`}
            >
              <div className="imports-document-item">
                <div>
                  <p className="imports-document-item-name">
                    {item.productName}
                  </p>
                  <p className="imports-document-item-meta">
                    SKU: {item.sku || "N/A"}
                  </p>
                  <p className="imports-document-item-meta">
                    {item.description || "Không có mô tả."}
                  </p>
                </div>
              </div>
              <strong>{formatNumber(item.quantity)}</strong>
              <strong>{formatCurrency(item.unitCost)}</strong>
              <strong>{formatCurrency(item.lineTotal)}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="imports-document-summary">
        <div>
          <span>Tổng số lượng</span>
          <strong>{formatNumber(receipt.totalQuantity)}</strong>
        </div>
        <div>
          <span>Tổng tiền hàng</span>
          <strong>{formatCurrency(receipt.subTotal)}</strong>
        </div>
        <div className="imports-document-summary-total">
          <span>Tổng cộng</span>
          <strong>{formatCurrency(receipt.totalAmount)}</strong>
        </div>
      </section>
    </div>
  );
}

export default function ExportReceiptDetail({
  receipt,
  viewMode = "paper",
  paperRef = null,
  showStatus = true,
}) {
  return (
    <div className="imports-detail-page">
      {viewMode === "paper" ? (
        <div className="imports-paper-wrap">
          <div className="imports-paper-with-status">
            <div ref={paperRef}>
              <ExportReceiptPaper receipt={receipt} />
            </div>

            {showStatus && (
              <div className="imports-paper-status-aside">
                <span className="imports-paper-badge">
                  {receipt.statusLabel || "CHÍNH THỨC"}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <ExportReceiptDocumentView
            receipt={receipt}
            showStatus={showStatus}
          />
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
