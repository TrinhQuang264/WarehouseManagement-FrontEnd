import { formatNumber, formatCurrency } from "../../../utils/util";

export default function ReportTable({ reportData, columnTotals, loading }) {
  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-500 font-medium">
        Đang tải dữ liệu báo cáo...
      </div>
    );
  }

  if (reportData.length === 0) {
    return (
      <div className="py-20 text-center text-xs text-slate-500 font-medium">
        Không tìm thấy dữ liệu linh kiện phù hợp.
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse text-slate-700">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
          <th className="font-bold uppercase tracking-wider text-[10px] border-r border-slate-200 px-3 py-2.5" rowSpan="2">
            Mã linh kiện
          </th>
          <th className="font-bold uppercase tracking-wider text-[10px] border-r border-slate-200 px-3 py-2.5" rowSpan="2">
            Tên linh kiện
          </th>
          <th className="text-center font-bold uppercase tracking-wider text-[10px] border-b border-r border-slate-200 py-1.5 bg-slate-50/50" colSpan="2">
            Tồn đầu kỳ
          </th>
          <th className="text-center font-bold uppercase tracking-wider text-[10px] border-b border-r border-slate-200 py-1.5" colSpan="2">
            Nhập trong kỳ
          </th>
          <th className="text-center font-bold uppercase tracking-wider text-[10px] border-b border-r border-slate-200 py-1.5 bg-slate-50/50" colSpan="2">
            Xuất trong kỳ
          </th>
          <th className="text-center font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 py-1.5" colSpan="2">
            Tồn cuối kỳ
          </th>
        </tr>
        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
          <th className="text-right font-medium text-[10px] border-r border-slate-200 bg-slate-50/30 px-3 py-2">Số lượng</th>
          <th className="text-right font-medium text-[10px] border-r border-slate-200 bg-slate-50/30 px-3 py-2">Giá trị</th>
          <th className="text-right font-medium text-[10px] border-r border-slate-200 px-3 py-2">Số lượng</th>
          <th className="text-right font-medium text-[10px] border-r border-slate-200 px-3 py-2">Giá trị</th>
          <th className="text-right font-medium text-[10px] border-r border-slate-200 bg-slate-50/30 px-3 py-2">Số lượng</th>
          <th className="text-right font-medium text-[10px] border-r border-slate-200 bg-slate-50/30 px-3 py-2">Giá trị</th>
          <th className="text-right font-medium text-[10px] border-r border-slate-200 px-3 py-2">Số lượng</th>
          <th className="text-right font-medium text-[10px] px-3 py-2">Giá trị</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 text-slate-800">
        {reportData.map((row) => (
          <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
            <td className="font-mono text-primary font-medium px-3 py-2 text-xs">{row.code}</td>
            <td className="font-semibold text-slate-900 px-3 py-2 text-xs">{row.name}</td>
            {/* Tồn đầu kỳ */}
            <td className="text-right font-mono text-slate-600 bg-slate-50/10 px-3 py-2 text-xs">{formatNumber(row.openingQty)}</td>
            <td className="text-right font-mono text-slate-600 bg-slate-50/10 px-3 py-2 text-xs cursor-help" title={formatCurrency(row.openingVal)}>{formatCurrency(row.openingVal)}</td>
            {/* Nhập trong kỳ */}
            <td className="text-right font-mono text-slate-900 px-3 py-2 text-xs font-semibold">{formatNumber(row.importQty)}</td>
            <td className="text-right font-mono text-slate-900 px-3 py-2 text-xs cursor-help font-semibold" title={formatCurrency(row.importVal)}>{formatCurrency(row.importVal)}</td>
            {/* Xuất trong kỳ */}
            <td className="text-right font-mono text-slate-600 bg-slate-50/10 px-3 py-2 text-xs">{formatNumber(row.exportQty)}</td>
            <td className="text-right font-mono text-slate-600 bg-slate-50/10 px-3 py-2 text-xs cursor-help" title={formatCurrency(row.exportVal)}>{formatCurrency(row.exportVal)}</td>
            {/* Tồn cuối kỳ */}
            <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">{formatNumber(row.closingQty)}</td>
            <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs cursor-help" title={formatCurrency(row.closingVal)}>{formatCurrency(row.closingVal)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="bg-slate-100 border-t-2 border-primary/20 text-slate-900">
          <td className="font-bold uppercase tracking-wider text-[10px] py-3 pl-4" colSpan="2">Tổng cộng cuối kỳ</td>
          <td className="text-right font-mono font-bold bg-slate-50/50 px-3 py-2 text-xs">{formatNumber(columnTotals.openingQty)}</td>
          <td className="text-right font-mono font-bold bg-slate-50/50 px-3 py-2 text-xs cursor-help" title={formatCurrency(columnTotals.openingVal)}>{formatCurrency(columnTotals.openingVal)}</td>
          <td className="text-right font-mono font-bold px-3 py-2 text-xs">{formatNumber(columnTotals.importQty)}</td>
          <td className="text-right font-mono font-bold px-3 py-2 text-xs cursor-help" title={formatCurrency(columnTotals.importVal)}>{formatCurrency(columnTotals.importVal)}</td>
          <td className="text-right font-mono font-bold bg-slate-50/50 px-3 py-2 text-xs">{formatNumber(columnTotals.exportQty)}</td>
          <td className="text-right font-mono font-bold bg-slate-50/50 px-3 py-2 text-xs cursor-help" title={formatCurrency(columnTotals.exportVal)}>{formatCurrency(columnTotals.exportVal)}</td>
          <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs">{formatNumber(columnTotals.closingQty)}</td>
          <td className="text-right font-mono font-bold text-primary px-3 py-2 text-xs cursor-help" title={formatCurrency(columnTotals.closingVal)}>{formatCurrency(columnTotals.closingVal)}</td>
        </tr>
      </tfoot>
    </table>
  );
}
