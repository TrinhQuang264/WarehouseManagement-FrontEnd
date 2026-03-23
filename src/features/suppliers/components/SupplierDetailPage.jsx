import React from "react";
import {
  Factory,
  Eye,
  FileText,
  Pencil,
  Phone,
  MapPin,
  Receipt,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import DataTableCard from "../../../components/ui/DataTableCard.jsx";
import PaginationBar from "../../../components/ui/PaginationBar.jsx";
import {
  COMMON_URLS,
  IMPORT_URLS,
  SUPPLIER_URLS,
} from "../../../constants/urls.js";
import { formatCurrency } from "../../../utils/util.js";

function statusBadge(status) {
  const map = {
    completed: "bg-emerald-100 text-emerald-700",
    pending: "bg-red-100 text-red-700",
    cancelled: "bg-slate-100 text-slate-600",
  };
  return map[status] || "bg-slate-100 text-slate-600";
}

export default function SupplierDetailPage({ supplier, history = [], onEdit }) {
  const totalImport = history.reduce((sum, item) => sum + item.totalAmount, 0);
  const debt = Math.round(totalImport * 0.12);

  return (
    <div className="suppliers-page">
      <div className="page-header">
        <div className="w-full">
          <nav className="flex items-center justify-between text-sm text-slate-500 mb-2">
            {/* Breadcrumb bên trái */}
            <div className="flex items-center">
              <Link
                to={COMMON_URLS.dashboard}
                className="hover:text-primary transition-colors"
              >
                Trang chủ
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <Link
                to={SUPPLIER_URLS.list}
                className="hover:text-primary transition-colors"
              >
                Nhà cung cấp
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-900 dark:text-white font-medium">
                Chi tiết nhà cung cấp
              </span>
            </div>

            {/* Buttons bên phải */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => onEdit?.(supplier)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Pencil size={16} />
                Chỉnh sửa
              </button>
              <Link
                to={IMPORT_URLS.new}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:opacity-90"
              >
                <Receipt size={16} />
                Phiếu nhập mới
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Factory size={28} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Thông tin liên hệ
                  </h2>
                  <p className="text-xs text-slate-500">
                    Được đồng bộ trong hệ thống
                  </p>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Người liên hệ
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {supplier.contactPerson}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Email
                  </p>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {supplier.email}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Số điện thoại
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {supplier.phone}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Địa chỉ kho
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-900">
                    {supplier.address}
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-100 bg-slate-50 p-4 text-center text-xs font-bold uppercase tracking-widest text-primary">
              Xem tất cả địa điểm
            </div>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Tổng giá trị nhập
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(totalImport)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Số phiếu nhập
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {history.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Công nợ hiện tại
                </p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(debt)}
                  </p>
                  <button
                    type="button"
                    className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase text-primary"
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <DataTableCard>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h3 className="text-lg font-bold text-slate-900">
                Lịch sử nhập hàng
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Lọc
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  Xuất Excel
                </button>
              </div>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="table-th px-6">Mã Phiếu</th>
                    <th className="table-th px-6">Ngày Nhập</th>
                    <th className="table-th px-6 text-right">Tổng Tiền</th>
                    <th className="table-th px-6 text-center">Trạng Thái</th>
                    <th className="table-th px-6 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <tr key={item.id} className="table-row-hover">
                      <td className="px-6 py-4 text-sm font-bold text-primary">
                        {item.code}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.dateLabel}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                        {formatCurrency(item.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tight ${statusBadge(item.status)}`}
                        >
                          {item.statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={item.href}
                          className="inline-flex rounded-lg p-2 text-slate-400 hover:bg-primary/5 hover:text-primary"
                        >
                          <Eye size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationBar
              info={
                <span className="pagination-info">
                  Hiển thị{" "}
                  <span className="font-bold text-slate-900">
                    {history.length}
                  </span>{" "}
                  trên tổng số{" "}
                  <span className="font-bold text-slate-900">
                    {history.length}
                  </span>{" "}
                  phiếu nhập
                </span>
              }
            >
              <div className="pagination-controls">
                <button className="pagination-btn" disabled>
                  {"<"}
                </button>
                <div className="pagination-page-list">
                  <button className="pagination-page-btn pagination-page-btn-active">
                    1
                  </button>
                </div>
                <button className="pagination-btn" disabled>
                  {">"}
                </button>
              </div>
            </PaginationBar>
          </DataTableCard>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="mb-3 font-bold text-slate-900">
                Hợp đồng pháp lý
              </h4>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <FileText size={20} className="text-red-500" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">
                    Contract_{supplier.code}.pdf
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">
                    Hết hạn: 31/12/2026
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Tải
                </button>
              </div>
              <button
                type="button"
                className="mt-5 w-full border-t border-slate-100 pt-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-primary"
              >
                Gia hạn hợp đồng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
