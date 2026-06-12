import React from "react";
import {
  MoreVertical,
  Smartphone,
  BatteryCharging,
  Camera,
  Layers,
  Cpu,
} from "lucide-react";
import Badge from "../../../components/ui/Badge.jsx";
import DataTableCard from "../../../components/ui/DataTableCard.jsx";
import { formatNumber, getProductImageUrl } from "../../../utils/util.js";

const getCategoryIcon = (catId) => {
  switch (catId) {
    case 4:
      return <Smartphone size={18} className="text-slate-400" />;
    case 5:
      return <BatteryCharging size={18} className="text-slate-400" />;
    case 6:
      return <Camera size={18} className="text-slate-400" />;
    case 7:
      return <Layers size={18} className="text-slate-400" />;
    default:
      return <Cpu size={18} className="text-slate-400" />;
  }
};

function ProductThumbnail({ imageUrl, name }) {
  const fullImageUrl = getProductImageUrl(imageUrl);
  const hasImage = Boolean(fullImageUrl);

  return (
    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:shadow-sm transition-all duration-300">
      {hasImage ? (
        <img
          src={fullImageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          N/A
        </span>
      )}
    </div>
  );
}

export default function InventoryTable({ products, categories, loading }) {
  return (
    <DataTableCard className="relative min-h-[500px] flex flex-col">
      <div className="table-wrapper flex-grow">
        <table className="table w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              <th className="table-th px-6">Sản phẩm</th>
              <th className="table-th px-6">Dạnh mục</th>
              <th className="table-th px-6 text-center">SL tồn</th>
              <th className="table-th px-6 text-right">Đơn giá (VNĐ)</th>
              <th className="table-th px-6 text-center">Cảnh báo</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y divide-slate-100 transition-opacity duration-300 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
          >
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="group hover:bg-slate-50/80 transition-all duration-300 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <ProductThumbnail
                          imageUrl={product.imageUrl}
                          name={product.name}
                        />
                      ) : (
                        <div className="h-10 w-10 shrink-0 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                          {getCategoryIcon(product.categoryId)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                          {product.name}
                        </p>
                        <p className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-wider">
                          {product.code}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="blue"
                      className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] uppercase"
                    >
                      {categories.find((c) => c.id === product.categoryId)
                        ?.name || "Linh kiện"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`text-sm font-black ${product.quantity <= 10 ? "text-red-500" : "text-slate-900"}`}
                    >
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600 text-right">
                    {formatNumber(product.sellingPrice)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {product.quantity <= 10 ? (
                        <Badge
                          variant="danger"
                          className="flex items-center gap-1 animate-pulse py-1 px-3 border-red-200"
                        >
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                          Tồn thấp
                        </Badge>
                      ) : (
                        <Badge
                          variant="success"
                          className="py-1 px-3 border-emerald-200"
                        >
                          An toàn
                        </Badge>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-slate-400 italic"
                >
                  Không tìm thấy dữ liệu tồn kho...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DataTableCard>
  );
}
