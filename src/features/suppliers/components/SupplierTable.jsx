import React from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import DataTableCard from "../../../components/ui/DataTableCard.jsx";

function SupplierTable({
  suppliers,
  loading,
  onEdit,
  onDelete,
  onViewDetail,
}) {
  return (
    <DataTableCard className="min-h-[500px] flex flex-col relative">
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              <th className="table-th px-6">Tên Nhà Cung Cấp</th>
              <th className="table-th px-6">Người liên hệ</th>
              <th className="table-th px-6">Số Điện Thoại</th>
              <th className="table-th px-6">Địa Chỉ</th>
              <th className="table-th px-6 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y divide-slate-100 dark:divide-slate-800/50 transition-opacity duration-300 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
          >
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <tr key={supplier.id} className="group table-row-hover">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {supplier.supplierName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {supplier.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {supplier.contactPerson || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {supplier.phone}
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 max-w-xs xl:max-w-md"
                      title={supplier.address}
                    >
                      {supplier.address}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="action-buttons-group">
                      <button
                        onClick={() => onViewDetail?.(supplier)}
                        className="action-btn text-slate-400 hover:text-primary"
                        title="Chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onEdit(supplier)}
                        className="action-btn text-slate-400 hover:text-primary"
                        title="Sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(supplier)}
                        className="action-btn text-slate-400 hover:text-red-500"
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
                  colSpan="5"
                  className="px-6 py-12 text-center text-slate-400 italic"
                >
                  Chưa có dữ liệu nhà cung cấp...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DataTableCard>
  );
}

export default React.memo(SupplierTable);
