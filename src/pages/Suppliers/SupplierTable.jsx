import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

/**
 * SupplierTable - Thành phần hiển thị danh sách nhà cung cấp
 * @param {Array} suppliers - Danh sách nhà cung cấp
 * @param {function} onEdit - Hàm khi click sửa
 * @param {function} onDelete - Hàm khi click xóa
 */
export default function SupplierTable({ suppliers, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">Tên Nhà Cung Cấp</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">Mã NCC</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">Số Điện Thoại</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">Địa Chỉ</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {suppliers.length > 0 ? suppliers.map((supplier) => (
              <tr key={supplier.id} className="group hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300">
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
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono font-bold tracking-wider border border-slate-200 dark:border-slate-700">
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
                  <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={() => onEdit(supplier)}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-lg shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all" title="Sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(supplier)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all" title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">
                  Chưa có dữ liệu nhà cung cấp...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
