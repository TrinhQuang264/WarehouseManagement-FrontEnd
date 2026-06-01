<<<<<<< HEAD
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function SupplierTable({ suppliers, onEdit, onDelete }) {
  return (
    <div className="supplier-table-card">
=======
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
<<<<<<< HEAD
    <DataTableCard className="min-h-[500px] flex flex-col relative">
=======
    <DataTableCard>
>>>>>>> c9d4396b0eea2861fbc38a435f7cd5d40ab73b2a
>>>>>>> 3a5566f739b6b8c84db6d85232bb921ac357dbbf
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
<<<<<<< HEAD
          <tbody
            className={`divide-y divide-slate-100 dark:divide-slate-800/50 transition-opacity duration-300 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
          >
=======
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
<<<<<<< HEAD
            {suppliers.length > 0 ? suppliers.map((supplier) => (
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
                  <span className="supplier-code-badge">
                    {supplier.code}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                  {supplier.phone}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 max-w-xs xl:max-w-md" title={supplier.address}>
                    {supplier.address}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="action-buttons-group">
                    <button 
                      onClick={() => onEdit(supplier)}
                      className="action-btn text-slate-400 hover:text-primary" title="Sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(supplier)}
                      className="action-btn text-slate-400 hover:text-red-500" title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">
=======
>>>>>>> 3a5566f739b6b8c84db6d85232bb921ac357dbbf
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
>>>>>>> c9d4396b0eea2861fbc38a435f7cd5d40ab73b2a
                  Chưa có dữ liệu nhà cung cấp...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
<<<<<<< HEAD
    </div>
=======
    </DataTableCard>
>>>>>>> c9d4396b0eea2861fbc38a435f7cd5d40ab73b2a
  );
}

export default React.memo(SupplierTable);
