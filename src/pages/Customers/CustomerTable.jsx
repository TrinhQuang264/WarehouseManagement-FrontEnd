import React from 'react';
import { Edit, Trash2, User } from 'lucide-react';

/**
 * CustomerTable - Thành phần hiển thị danh sách khách hàng
 */
export default function CustomerTable({ customers, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">Khách hàng</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">Mã KH</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">Số Điện Thoại</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">Địa Chỉ</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {customers.length > 0 ? customers.map((customer) => (
              <tr key={customer.id} className="group hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {customer.fullName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {customer.email || 'customer@example.com'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono font-bold tracking-wider border border-slate-200 dark:border-slate-700">
                    {customer.code}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                  {customer.phoneNumber}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 max-w-xs xl:max-w-md" title={customer.address}>
                    {customer.address}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={() => onEdit(customer)}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-lg shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all" title="Sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(customer)}
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
                  Chưa có dữ liệu khách hàng...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
