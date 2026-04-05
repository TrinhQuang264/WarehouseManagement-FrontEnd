import React from "react";
import { Edit, Trash2, FolderOpen } from "lucide-react";

export default function CategoryTable({
  categories,
  loading,
  onEdit,
  onDelete,
}) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
            <th className="table-th px-6">ID</th>
            <th className="table-th px-6">Tên Danh Mục</th>
            <th className="table-th px-6">Mô Tả SEO</th>
            <th className="table-th px-6 text-right">Thao Tác</th>
          </tr>
        </thead>
        <tbody
          className={`divide-y divide-slate-100 dark:divide-slate-800/50 transition-opacity duration-300 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          {categories.length > 0 ? (
            categories.map((category) => (
              <tr key={category.id} className="group table-row-hover">
                <td className="px-6 py-5 text-sm font-bold text-slate-700 dark:text-slate-300">
                  #{category.id.toString().padStart(4, "0")}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="category-icon-box bg-primary/10 text-primary p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <FolderOpen size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {category.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-slate-500 max-w-xs truncate">
                  {category.seoDescription || "Chưa có mô tả"}
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
