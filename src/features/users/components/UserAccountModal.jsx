import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { getRoleLabel } from "../utils/roleUtils";

function RoleField({ roleNames, checkedRoles, setCheckedRoles, name }) {
  return roleNames.map((roleName) => (
    <label key={roleName} className="flex items-center gap-2 mb-2">
      <input type="radio" name={name} checked={checkedRoles[0] === roleName} onChange={() => setCheckedRoles([roleName])} />
      <span>{getRoleLabel(roleName)}</span>
    </label>
  ));
}

export default function UserAccountModal({
  isOpen, onClose, title, form, setForm, roleNames, checkedRoles, setCheckedRoles, onSubmit, saving, submitLabel, showDelete = false, onDelete,
}) {
  const formKeys = ["email", "phoneNumber", "firstName", "lastName", "userName", "password"];
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div className={`flex gap-2 w-full ${showDelete ? "justify-between" : "justify-end"}`}>
          {showDelete ? <Button variant="danger" onClick={onDelete} disabled={saving}>Xóa tài khoản</Button> : null}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>Hủy</Button>
            <Button onClick={onSubmit} disabled={saving}>{saving ? "Đang lưu..." : submitLabel}</Button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {formKeys.map((key) => (
          <input
            key={key}
            type={key === "password" ? "password" : "text"}
            placeholder={key === "password" ? "password (để trống nếu không đổi)" : key}
            value={form[key] || ""}
            onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
            className="h-10 rounded-lg border border-slate-300 px-3"
          />
        ))}
      </div>
      <p className="text-sm font-semibold mb-2">Vai trò</p>
      <RoleField roleNames={roleNames} checkedRoles={checkedRoles} setCheckedRoles={setCheckedRoles} name={`${title}-role`} />
    </Modal>
  );
}

