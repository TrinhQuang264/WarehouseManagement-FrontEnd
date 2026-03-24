import React from 'react';
import { Mail, Phone, MapPin, ShoppingBag, Star, Eye, Pencil, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import DataTableCard from '../../../components/ui/DataTableCard.jsx';
import PaginationBar from '../../../components/ui/PaginationBar.jsx';
import { COMMON_URLS, CUSTOMER_URLS } from '../../../constants/urls.js';
import { formatCurrency } from '../../../utils/util.js';

function statusBadge(status) {
  const map = {
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
}

export default function CustomerDetailPage({ customer, history = [], onEdit }) {
  const initials = String(customer.fullName || 'KH').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const totalSpend = history.reduce((sum, item) => sum + item.totalAmount, 0);
  const score = Math.max(250, history.length * 52);

  return (
    <div className="customers-page">
     <div className="page-header">
        <div className="w-full">
          <nav className="flex items-center justify-between text-sm text-slate-500 mb-2">
            {/* Breadcrumb bên trái */}
            <div className="flex items-center">
              <Link to={COMMON_URLS.dashboard} className="hover:text-primary transition-colors">Trang chủ</Link>
              <span className="mx-2 text-slate-300">/</span>
              <Link to={CUSTOMER_URLS.list} className="hover:text-primary transition-colors">Khách hàng</Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-900 dark:text-white font-medium">Chi tiết khách hàng</span>
            </div>

            {/* Buttons bên phải */}
            <div className="flex items-center gap-3 flex-wrap">
              <button type="button" onClick={() => onEdit?.(customer)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:opacity-90">
                <Pencil size={16} />Chỉnh sửa thông tin
              </button>
            </div>
          </nav>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-black text-primary ring-4 ring-slate-50">{initials}</div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-900">{customer.fullName}</h2>
              <p className="mt-2 inline-flex rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">{customer.code}</p>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"><Phone size={18} className="mt-0.5 text-slate-500" /><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Số điện thoại</p><p className="mt-1 text-sm font-semibold text-slate-900">{customer.phoneNumber}</p></div></div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"><Mail size={18} className="mt-0.5 text-slate-500" /><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</p><p className="mt-1 text-sm font-semibold text-slate-900">{customer.email}</p></div></div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"><MapPin size={18} className="mt-0.5 text-slate-500" /><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Địa chỉ giao hàng</p><p className="mt-1 text-sm font-semibold leading-relaxed text-slate-900">{customer.address}</p></div></div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><ShoppingBag size={20} /></div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Tổng chi tiêu</p><p className="mt-1 text-2xl font-black text-slate-900">{formatCurrency(totalSpend)}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><MessageSquare size={20} /></div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Số đơn hàng</p><p className="mt-1 text-2xl font-black text-slate-900">{history.length}</p></div>
          </div>

          <DataTableCard>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><h3 className="text-lg font-bold text-slate-900">Lịch sử giao dịch</h3><button type="button" className="text-sm font-bold text-primary hover:underline">Xem tất cả</button></div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="table-th px-6">Mã Phiếu Xuất</th>
                    <th className="table-th px-6">Ngày giao dịch</th>
                    <th className="table-th px-6 text-right">Tổng tiền</th>
                    <th className="table-th px-6 text-center">Trạng thái</th>
                    <th className="table-th px-6 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <tr key={item.id} className="table-row-hover">
                      <td className="px-6 py-4 text-sm font-bold text-primary">{item.code}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.dateLabel}</td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">{formatCurrency(item.totalAmount)}</td>
                      <td className="px-6 py-4 text-center"><span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tight ${statusBadge(item.status)}`}>{item.statusLabel}</span></td>
                      <td className="px-6 py-4 text-right"><Link to={item.href} className="inline-flex rounded-lg p-2 text-slate-400 hover:bg-primary/5 hover:text-primary"><Eye size={18} /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationBar info={<span className="pagination-info">Hiển thị <span className="font-bold text-slate-900">{history.length}</span> trên tổng số <span className="font-bold text-slate-900">{history.length}</span> đơn hàng</span>}>
              <div className="pagination-controls"><button className="pagination-btn" disabled>{'<'}</button><div className="pagination-page-list"><button className="pagination-page-btn pagination-page-btn-active">1</button></div><button className="pagination-btn" disabled>{'>'}</button></div>
            </PaginationBar>
          </DataTableCard>
        </div>
      </div>
    </div>
  );
}
