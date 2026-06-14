import { formatNumber, formatCurrency } from "../../../utils/util";
import { useNavigate } from "react-router-dom";

export default function DashboardTables({ restockProducts, topProducts }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-3">
      {/* Table 1: Sản phẩm cần nhập thêm */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Sản phẩm cần nhập thêm
          </h3>
          <button
            onClick={() => navigate("/inventory")}
            className="text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Xem tất cả
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Mã sản phẩm
                </th>
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Tên sản phẩm
                </th>
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">
                  Tồn kho
                </th>
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Mức cảnh báo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {restockProducts.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-3 py-2 text-[11px] font-mono text-slate-600">
                    {item.id}
                  </td>
                  <td className="px-3 py-2 text-[11px] font-semibold text-slate-800">
                    {item.name}
                  </td>
                  <td className="px-3 py-2 text-[11px] font-bold text-slate-800 text-right">
                    {item.stock}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.color === "red"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Sản phẩm xuất nhiều nhất */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Sản phẩm xuất nhiều nhất
          </h3>
          <button
            onClick={() => navigate("/export")}
            className="text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Xem chi tiết
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Sản phẩm
                </th>
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">
                  Số lượng xuất
                </th>
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">
                  Doanh thu
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProducts.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold text-slate-800">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {item.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-[11px] font-bold text-slate-800 text-right">
                    {formatNumber(item.sold)}
                  </td>
                  <td className="px-3 py-2 text-[11px] font-bold text-emerald-600 text-right">
                    {formatCurrency(item.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
