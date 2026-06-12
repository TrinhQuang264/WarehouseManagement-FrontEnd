import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { getRoleLabel } from "../utils/roleUtils";
import { Mail, Phone, User, Lock, Award, Trash2 } from "lucide-react";

function RoleField({ roleNames, checkedRoles, setCheckedRoles, name }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-1">
      {roleNames.map((roleName) => {
        const isChecked = checkedRoles[0] === roleName;
        return (
          <label
            key={roleName}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
              isChecked
                ? "border-primary bg-primary/5 text-primary shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name={name}
              checked={isChecked}
              onChange={() => setCheckedRoles([roleName])}
              className="w-4 h-4 text-primary focus:ring-primary border-slate-300 cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold">{getRoleLabel(roleName)}</span>
              <span className="text-[10px] text-slate-400 font-medium">
                {roleName === "Admin" ? "Toàn quyền quản trị" : "Quyền nhân viên kho"}
              </span>
            </div>
          </label>
        );
      })}
    </div>
  );
}

export default function UserAccountModal({
  isOpen,
  onClose,
  title,
  form,
  setForm,
  roleNames,
  checkedRoles,
  setCheckedRoles,
  onSubmit,
  saving,
  submitLabel,
  showDelete = false,
  onDelete,
}) {
  const fields = [
    { key: "userName", label: "Tên đăng nhập *", placeholder: "nhap_ten_dang_nhap", icon: <User size={15} /> },
    { key: "password", label: "Mật khẩu *", placeholder: "••••••••", type: "password", icon: <Lock size={15} /> },
    { key: "email", label: "Địa chỉ Email *", placeholder: "email@example.com", icon: <Mail size={15} /> },
    { key: "phoneNumber", label: "Số điện thoại", placeholder: "09xxxxxxxx", icon: <Phone size={15} /> },
    { key: "fullName", label: "Họ và tên *", placeholder: "Ví dụ: Nguyễn Văn Nam", icon: <User size={15} /> },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<span className="text-base font-bold text-slate-900">{title}</span>}
      footer={
        <div className={`flex items-center gap-3 w-full ${showDelete ? "justify-between" : "justify-end"}`}>
          {showDelete ? (
            <button
              onClick={onDelete}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 active:scale-95"
            >
              <Trash2 size={14} />
              Xóa tài khoản
            </button>
          ) : null}
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose} disabled={saving}>
              Hủy
            </Button>
            <Button onClick={onSubmit} disabled={saving}>
              {saving ? "Đang xử lý..." : submitLabel}
            </Button>
          </div>
        </div>
      }
    >
      <div className="py-2">
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {fields.map(({ key, label, placeholder, type = "text", icon }) => {
            const isPasswordField = key === "password";
            const actualLabel = isPasswordField && showDelete ? "Mật khẩu mới (bỏ trống nếu giữ nguyên)" : label;
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {actualLabel}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    {icon}
                  </span>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key] || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-slate-50/30 transition-all"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Roles Field */}
        <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Award size={14} className="text-slate-400" />
            <span>Vai trò & Quyền hạn</span>
          </div>
          <RoleField
            roleNames={roleNames}
            checkedRoles={checkedRoles}
            setCheckedRoles={setCheckedRoles}
            name={`${title}-role`}
          />
        </div>
      </div>
    </Modal>
  );
}

