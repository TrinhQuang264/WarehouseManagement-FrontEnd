import { Edit, Ban, CheckCircle } from "lucide-react";
import Badge from "../../../components/ui/Badge";

function UserRow({ user, onEditRoles, onToggleActive }) {
  return (
    <tr className="table-row-hover">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-medium text-slate-900 ">{user.fullName}</p>
            <p className="text-xs text-slate-500 ">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm font-medium text-slate-600">{user.username}</td>
      <td className="px-6 py-4 text-sm text-slate-600 ">{user.phoneNumber || "—"}</td>
      <td className="px-6 py-4">
        <Badge variant={user.role === "admin" ? "blue" : "gray"}>{user.roleLabel}</Badge>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${!user.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
          <span className={`text-sm font-medium ${!user.isActive ? "text-emerald-600" : "text-red-500"}`}>
            {!user.isActive ? "Đang hoạt động" : "Đã khóa"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="action-buttons-group justify-end">
          <button className="action-btn text-slate-400 hover:text-primary flex items-center gap-1" title="Chỉnh sửa vai trò" onClick={() => onEditRoles(user)}>
            <Edit size={18} />
            <span className="text-xs">Chỉnh sửa</span>
          </button>
          {!user.isActive ? (
            <button className="action-btn text-slate-400 hover:text-accent-red hover:bg-red-50" title="Khóa tài khoản" onClick={() => onToggleActive(user)}>
              <Ban size={18} />
            </button>
          ) : (
            <button className="action-btn text-primary hover:bg-primary/10" title="Mở khóa tài khoản" onClick={() => onToggleActive(user)}>
              <CheckCircle size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function UsersTable({ users, onEditRoles, onToggleActive }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th className="table-th px-6">Người dùng</th>
            <th className="table-th px-6">Tên đăng nhập</th>
            <th className="table-th px-6">Số điện thoại</th>
            <th className="table-th px-6">Vai trò</th>
            <th className="table-th px-6">Trạng thái</th>
            <th className="table-th px-6 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 ">
          {users.map((user) => <UserRow key={user.id} user={user} onEditRoles={onEditRoles} onToggleActive={onToggleActive} />)}
        </tbody>
      </table>
    </div>
  );
}

