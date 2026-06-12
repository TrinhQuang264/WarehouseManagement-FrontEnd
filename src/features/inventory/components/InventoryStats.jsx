import { Package, AlertTriangle, DollarSign, Clock } from "lucide-react";
import ReceiptStats from "../../receipts/components/ReceiptStats.jsx";
import { formatCompact } from "../../../utils/util.js";

const STAT_CONFIG = [
  {
    key: "totalItems",
    label: "Tổng mặt hàng",
    icon: Package,
    iconClassName: "bg-blue-100 text-blue-600",
    formatter: (value) => formatCompact(value),
  },
  {
    key: "lowStock",
    label: "Sắp hết hàng",
    icon: AlertTriangle,
    iconClassName: "bg-red-100 text-red-600",
    formatter: (value) => value,
  },
  {
    key: "totalValue",
    label: "Tổng giá trị kho",
    icon: DollarSign,
    iconClassName: "bg-emerald-100 text-emerald-600",
    formatter: (value) => formatCompact(value),
  },
  {
    key: "lastUpdate",
    label: "Cập nhật lần cuối",
    icon: Clock,
    iconClassName: "bg-amber-100 text-amber-600",
    formatter: (value) => value,
  },
];

export default function InventoryStats({ stats }) {
  return <ReceiptStats stats={stats} config={STAT_CONFIG} />;
}
