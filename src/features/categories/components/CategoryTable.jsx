import React from "react";
import { Edit, Trash2, FolderOpen } from "lucide-react";

function CategoryTable({ categories, loading, onEdit, onDelete }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200">
            <th className="table-th px-6">Tên Danh Mục</th>
            <th className="table-th px-6">Mô Tả SEO</th>
            <th className="table-th px-6 text-center">Số sản phẩm</th>
            <th className="table-th px-6 text-right">Thao Tác</th>
          </tr>
        </thead>
        <tbody
          className={` divide-slate-100 transition-opacity duration-300 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id} className="group table-row-hover">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="category-icon-box bg-primary/10 text-primary p-2.5 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-primary/20 group-hover:-translate-y-0.5">
                      <FolderOpen size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {category.name}
                      </span>
                      {category.seoAlias && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          /{category.seoAlias}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-slate-500 max-w-sm line-clamp-1 italic">
                    {category.seoDescription ||
                      "Chưa có mô tả SEO cho danh mục này"}
                  </p>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700 min-w-8">
                    {category.productCount ?? 0}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="action-btn text-slate-400 hover:text-primary p-2 hover:bg-primary/10 rounded-lg transition-all"
                      onClick={() => onEdit(category)}
                      title="Chỉnh sửa danh mục"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="action-btn text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all"
                      onClick={() => onDelete(category)}
                      title="Xóa danh mục"
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
                colSpan="4"
                className="px-6 py-12 text-center text-slate-400 italic"
              >
                Không tìm thấy danh mục nào thỏa mãn điều kiện...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default React.memo(CategoryTable);
