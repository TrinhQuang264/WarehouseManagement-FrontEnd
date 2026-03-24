import { Edit, Eye, Trash2 } from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import DataTableCard from '../../../components/ui/DataTableCard.jsx';
import { formatCurrency } from '../../../utils/util.js';

const STATUS_VARIANTS = {
  completed: 'green',
  pending: 'orange',
  cancelled: 'red',
  draft: 'gray',
};

function formatDateTime(value) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function ReceiptTable({
  receipts,
  onEdit,
  onViewDetail,
  onDelete,
  codeSubLabelKey = 'referenceCode',
  partyColumnLabel,
  partyNameKey,
  dateColumnLabel,
  emptyMessage,
}) {
  return (
    <DataTableCard>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              <th className="table-th px-6">Mã phiếu</th>
              <th className="table-th px-6">{partyColumnLabel}</th>
              <th className="table-th px-6">{dateColumnLabel}</th>
              <th className="table-th px-6 text-center">Số lượng</th>
              <th className="table-th px-6 text-center">Tổng tiền</th>
              <th className="table-th px-6">Trạng thái</th>
              <th className="table-th px-6 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {receipts.length > 0 ? (
              receipts.map((receipt) => (
                <tr key={receipt.id} className="group table-row-hover cursor-pointer" onDoubleClick={() => onViewDetail?.(receipt)}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-primary">{receipt.code}</span>
                      <span className="text-xs text-slate-500 line-clamp-1">{receipt[codeSubLabelKey]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{receipt[partyNameKey]}</span>
                      <span className="text-xs text-slate-500 line-clamp-1">{receipt.itemSummary}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{formatDateTime(receipt.date)}</td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-200">{receipt.totalQuantity}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(receipt.totalAmount)}</td>
                  <td className="px-6 py-4"><Badge variant={STATUS_VARIANTS[receipt.status] || 'gray'}>{receipt.statusLabel}</Badge></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button type="button" onClick={(event) => { event.stopPropagation(); onViewDetail?.(receipt); }} className="action-btn text-slate-400 hover:text-primary" title="Xem chi tiết"><Eye size={18} /></button>
                      <button type="button" onClick={(event) => { event.stopPropagation(); onEdit?.(receipt); }} className="action-btn text-slate-400 hover:text-primary" title="Chỉnh sửa"><Edit size={18} /></button>
                      <button type="button" onClick={(event) => { event.stopPropagation(); onDelete?.(receipt); }} className="action-btn text-slate-400 hover:text-red-500" title="Xóa"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-400 italic">{emptyMessage}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DataTableCard>
  );
}
