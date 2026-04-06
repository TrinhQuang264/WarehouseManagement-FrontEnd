import { Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "../../../utils/util";
import DataTableCard from "../../../components/ui/DataTableCard.jsx";
import BulkActionBar from "../../../components/ui/BulkActionBar";

function ProductThumbnail({ imageUrl, name }) {
  const hasImage = Boolean(imageUrl);

  return (
    <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0">
      {hasImage ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span className="text-[10px] font-bold text-slate-400 uppercase">N/A</span>
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
  selectedIds = [],
  toggleSelect,
  toggleSelectAll,
  clearSelection,
  onBulkDelete,
}) {
  const isAllSelected =
    products.length > 0 && selectedIds.length === products.length;
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <DataTableCard className="relative min-h-[500px] flex flex-col">
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              <th className="table-th px-6 w-10">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="table-th px-6 text-left">Mã Sản Phẩm</th>
              <th className="table-th px-6 text-left">Thông Tin Sản Phẩm</th>
              <th className="table-th px-6 text-left">Danh Mục</th>
              <th className="table-th px-6 text-right">Giá Bán (VNĐ)</th>
              <th className="table-th px-6 text-center">Tồn Kho</th>
              <th className="table-th px-6 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y divide-slate-100 dark:divide-slate-800/50 transition-opacity duration-300 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
          >
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  onDoubleClick={() => onViewDetail?.(product)}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${selectedIds.includes(product.id) ? "bg-primary/5" : ""}`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                      checked={selectedIds.includes(product.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelect(product.id);
                      }}
                    />
                  </td>
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
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      {categoryNameById.get(product.categoryId) || "Khác"}
                    </span>
                  </td>

                  {/* Giá Bán */}
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white text-right">
                    {formatCurrency(product.price)}
                  </td>

                  {/* Tồn Kho */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
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
                  colSpan="7"
                  className="px-6 py-12 text-center text-slate-400 italic"
                >
                  Không tìm thấy sản phẩm ...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <BulkActionBar
        selectedCount={selectedIds.length}
        isVisible={selectedIds.length > 0}
        onClearSelection={clearSelection}
        actions={[
          {
            label: "Xóa vào thùng rác",
            icon: <Trash2 size={16} />,
            onClick: onBulkDelete,
            variant: "danger",
          },
        ]}
      />
    </DataTableCard>
  );
}
