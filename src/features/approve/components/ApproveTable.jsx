import React from "react";
import { Check, X, Eye } from "lucide-react";
import Badge from "../../../components/ui/Badge.jsx";
import DataTableCard from "../../../components/ui/DataTableCard.jsx";
import { formatCurrency, formatNumber } from "../../../utils/util.js";

const TYPE_VARIANTS = {
  1: "blue",
  2: "purple",
};

const TYPE_LABELS = {
  1: "Nhập kho",
  2: "Xuất kho",
};

function formatDateTime(value) {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function ApproveTable({
  receipts,
  onApprove,
  onCancel,
  onViewDetail,
  emptyMessage = "Không có phiếu nào đang chờ duyệt.",
}) {
  return (
    <DataTableCard>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              <th className="table-th px-6">Mã phiếu</th>
              <th className="table-th px-6">Loại phiếu</th>
              <th className="table-th px-6">Đối tác</th>
              <th className="table-th px-6">Ngày tạo</th>
              <th className="table-th px-6 text-center">Số lượng</th>
              <th className="table-th px-6 text-right">Tổng tiền</th>
              <th className="table-th px-6 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {receipts.length > 0 ? (
              receipts.map((receipt) => (
                <tr
                  key={receipt.id}
                  className="group table-row-hover hover:bg-slate-50/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-primary">
                        {receipt.receiptCode}
                      </span>
                      {receipt.referenceCode && (
                        <span className="text-xs text-slate-500 line-clamp-1">
                          Ref: {receipt.referenceCode}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={TYPE_VARIANTS[receipt.type] || "gray"}>
                      {TYPE_LABELS[receipt.type] || "Không xác định"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {receipt.type === 2
                      ? receipt.customerName || "Khách hàng chưa xác định"
                      : receipt.supplierName || "Nhà cung cấp chưa xác định"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatDateTime(receipt.purchaseDate || receipt.createDate)}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                    {formatNumber(receipt.totalQuantity || (receipt.items || []).reduce((sum, item) => sum + item.quantity, 0))}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                    {formatCurrency(receipt.totalAmount || receipt.totalCost)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onViewDetail?.(receipt)}
                        className="p-1 text-slate-400 hover:text-primary transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onApprove(receipt)}
                        className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded text-xs font-semibold shadow-sm hover:shadow transition-all"
                        title="Duyệt phiếu"
                      >
                        <Check size={14} />
                        Duyệt
                      </button>
                      <button
                        type="button"
                        onClick={() => onCancel(receipt)}
                        className="flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white px-2 py-1 rounded text-xs font-semibold shadow-sm hover:shadow transition-all"
                        title="Hủy phiếu"
                      >
                        <X size={14} />
                        Hủy
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-slate-400 italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DataTableCard>
  );
}
