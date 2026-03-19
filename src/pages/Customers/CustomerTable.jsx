import React from 'react';
import { Edit, Trash2, User } from 'lucide-react';

export default function CustomerTable({ customers, onEdit, onDelete }) {
  return (
    <div className="supplier-table-card"> // Reusing shared table card style
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              <th className="table-th px-6">Khách hàng</th>
              <th className="table-th px-6">Mã KH</th>
              <th className="table-th px-6">Số Điện Thoại</th>
              <th className="table-th px-6">Địa Chỉ</th>
              <th className="table-th px-6 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {customers.length > 0 ? customers.map((customer) => (
              <tr key={customer.id} className="group table-row-hover">
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
                  <span className="customer-code-badge">
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
                  <div className="action-buttons-group">
                    <button 
                      onClick={() => onEdit(customer)}
                      className="action-btn text-slate-400 hover:text-primary" title="Sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(customer)}
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
