import { Edit, Trash2 } from "lucide-react";
import { formatCurrency, getProductImageUrl } from "../../../utils/util";
import DataTableCard from "../../../components/ui/DataTableCard.jsx";

function ProductThumbnail({ imageUrl, name }) {
  const fullImageUrl = getProductImageUrl(imageUrl);
  const hasImage = Boolean(fullImageUrl);

  return (
    <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">
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

export default function ProductsTable({
  products,
  categories,
  loading,
  onEdit,
  onDelete,
  onViewDetail,
}) {
  const categoryNameById = new Map(
    categories.map((category) => [Number(category.id), category.name]),
  );

  return (
    <DataTableCard className="relative min-h-[500px] flex flex-col">
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 ">
              <th className="table-th px-6 text-left">Mã Sản Phẩm</th>
              <th className="table-th px-6 text-left">Thông Tin Sản Phẩm</th>
              <th className="table-th px-6 text-left">Danh Mục</th>
              <th className="table-th px-6 text-left">Vị trí</th>
              <th className="table-th px-6 text-right">Giá Bán (VNĐ)</th>
              <th className="table-th px-6 text-center">Tồn Kho</th>
              <th className="table-th px-6 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y divide-slate-100  transition-opacity duration-300 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
          >
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50  transition-colors cursor-pointer"
                >
                  {/* Mã Sản Phẩm */}
                  <td className="px-6 py-4 font-mono text-sm text-primary font-medium">
                    {product.code}
                  </td>

                  {/* Thông Tin Sản Phẩm (Ảnh + Tên + Mô Tả) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <ProductThumbnail
                        imageUrl={product.imageUrl}
                        name={product.name}
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900 ">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {product.description || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Danh Mục */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-100  text-blue-600">
                      {categoryNameById.get(Number(product.categoryId)) ||
                        "Khác"}
                    </span>
                  </td>

                  {/* Ví trí của sản phẩm */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-100  text-blue-600">
                      {product.warehouseLocation}
                    </span>
                  </td>

                  {/* Giá Bán */}
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                    {formatCurrency(product.price)}
                  </td>

                  {/* Tồn Kho */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-medium text-slate-900 ">
                        {product.quantity}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          product.quantity > 50
                            ? "bg-emerald-500"
                            : product.quantity > 10
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                      />
                    </div>
                  </td>

                  {/* Thao Tác */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(product);
                        }}
                        className="p-1 hover:text-primary transition-colors text-slate-400"
                        title="Sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(product);
                        }}
                        className="p-1 hover:text-red-500 transition-colors text-slate-400"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
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
                  Không tìm thấy sản phẩm ...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DataTableCard>
  );
}
