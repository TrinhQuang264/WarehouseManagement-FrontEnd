import { Edit, Ban, CheckCircle, Shield, User } from "lucide-react";
import Badge from "../../../components/ui/Badge";

function UserRow({ user, onEditRoles, onToggleActive }) {
  const isSystemAdmin = user.role === "admin";

  return (
    <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
            {user.fullName ? user.fullName.charAt(0) : "U"}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {user.fullName}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              {user.email}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-3.5 font-mono text-xs text-slate-600 font-semibold">
        {user.username}
      </td>
      <td className="px-6 py-3.5 text-xs text-slate-500 font-medium">
        {user.phoneNumber || "—"}
      </td>
      <td className="px-6 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            isSystemAdmin
              ? "bg-blue-50 text-blue-600 border border-blue-200/50"
              : "bg-slate-50 text-slate-600 border border-slate-200"
          }`}
        >
          {isSystemAdmin ? <Shield size={10} /> : <User size={10} />}
          {user.roleLabel}
        </span>
      </td>
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              user.isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-400"
            }`}
          />
          <span
            className={`text-xs font-bold ${
              user.isActive ? "text-emerald-600" : "text-rose-500"
            }`}
          >
            {user.isActive ? "Hoạt động" : "Đã khóa"}
          </span>
        </div>
      </td>
      <td className="px-6 py-3.5 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEditRoles(user)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 hover:text-primary bg-slate-50 hover:bg-primary/5 rounded-lg transition-colors border border-slate-200 hover:border-primary/20"
            title="Chỉnh sửa tài khoản"
          >
            <Edit size={12} />
            Sửa
          </button>
          {user.isActive ? (
            <button
              onClick={() => onToggleActive(user)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200/50 rounded-lg transition-all"
              title="Khóa tài khoản"
            >
              <Ban size={13} />
            </button>
          ) : (
            <button
              onClick={() => onToggleActive(user)}
              className="p-1.5 text-emerald-500 hover:bg-emerald-50 border border-transparent hover:border-emerald-200/50 rounded-lg transition-all"
              title="Mở khóa tài khoản"
            >
              <CheckCircle size={13} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function UsersTable({ users, onEditRoles, onToggleActive }) {
  return (
    <div className="w-full overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500">
            <th className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider">
              Thành viên
            </th>
            <th className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider">
              Tên đăng nhập
            </th>
            <th className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider">
              Số điện thoại
            </th>
            <th className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider">
              Vai trò
            </th>
            <th className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider text-right">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onEditRoles={onEditRoles}
              onToggleActive={onToggleActive}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

