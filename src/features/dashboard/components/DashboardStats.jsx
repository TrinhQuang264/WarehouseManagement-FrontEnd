import { Package, Boxes, AlertTriangle, DollarSign } from "lucide-react";
import { formatNumber } from "../../../utils/util";

export default function DashboardStats({ stats }) {
  const formatCurrency = (value) => {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + " tỷ VNĐ";
    }
    return value.toLocaleString("vi-VN") + " VNĐ";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {/* Card 1: Tổng sản phẩm */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <Package size={20} />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-0.5">Tổng sản phẩm</p>
          <p className="text-xl font-bold text-slate-800">{formatNumber(stats.totalProducts)}</p>
        </div>
      </div>

      {/* Card 2: Tổng tồn kho */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <Boxes size={20} />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-0.5">Tổng tồn kho</p>
          <p className="text-xl font-bold text-slate-800">{formatNumber(stats.totalInventory)}</p>
        </div>
      </div>

      {/* Card 3: Sản phẩm sắp hết */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
          <AlertTriangle size={20} />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-0.5">Sản phẩm sắp hết</p>
          <p className="text-xl font-bold text-orange-600">{formatNumber(stats.lowStockCount)}</p>
        </div>
      </div>

      {/* Card 4: Giá trị tồn kho */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          <DollarSign size={20} />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-0.5">Giá trị tồn kho</p>
          <p className="text-xl font-bold text-emerald-600">{formatCurrency(stats.inventoryValue)}</p>
        </div>
      </div>
    </div>
  );
}
