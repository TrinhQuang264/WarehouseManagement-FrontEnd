import { ClipboardList, Clock3, PackageCheck, Wallet } from 'lucide-react';
import ReceiptStats from '../../receipts/components/ReceiptStats.jsx';
import { formatCompact } from '../../../utils/util.js';

const STAT_CONFIG = [
  { key: 'totalReceipts', label: 'Tổng phiếu xuất', icon: ClipboardList, iconClassName: 'bg-blue-100 text-blue-600', formatter: (value) => formatCompact(value) },
  { key: 'totalValue', label: 'Tổng giá trị xuất', icon: Wallet, iconClassName: 'bg-emerald-100 text-emerald-600', formatter: (value) => formatCompact(value) },
  { key: 'pendingCount', label: 'Chờ duyệt xuất', icon: Clock3, iconClassName: 'bg-amber-100 text-amber-600', formatter: (value) => value },
  { key: 'completedCount', label: 'Đã xuất kho', icon: PackageCheck, iconClassName: 'bg-primary/10 text-primary', formatter: (value) => value },
];

export default function ExportStats({ stats }) {
  return <ReceiptStats stats={stats} config={STAT_CONFIG} />;
}
