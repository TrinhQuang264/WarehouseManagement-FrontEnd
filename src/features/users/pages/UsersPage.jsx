import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Loading from "../../../components/ui/Loading";
import { useHeader } from "../../../contexts/HeaderContext";
import { useUsers } from "../hooks/useUsers.jsx";
import UsersPageLayout from "../components/UsersPageLayout";
import UserAccountModal from "../components/UserAccountModal";
import { ROLE_LABEL_TO_ID } from "../utils/roleUtils";
import toast from "../../../utils/toast";
import "../styles/Users.css";

const EMPTY_FORM = {
  email: "",
  phoneNumber: "",
  firstName: "",
  lastName: "",
  userName: "",
  password: "",
};

export default function UsersPage() {
  const { users, loading, setSearch, currentPage, setCurrentPage, totalUsers, pageSize, roles, createUserWithRoles, updateUserAccount, updateUserRoles, deleteUser, userRolesMap } = useUsers();
  const { setActionButton, setOnSearch, resetHeader } = useHeader();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [checkedRoles, setCheckedRoles] = useState(["User"]);
  const [saving, setSaving] = useState(false);

  const roleNames = useMemo(() => (roles || []).map((r) => r.name || r.id).filter(Boolean), [roles]);

  useEffect(() => {
    // Header action/search binding for users page.
    setActionButton({
      label: "Thêm người dùng",
      icon: <Plus size={18} />,
      onClick: () => setIsCreateOpen(true),
      searchPlaceholder: "Tìm kiếm theo tên đăng nhập hoặc vai trò...",
    });
    setOnSearch(() => setSearch);
    return () => resetHeader();
  }, [setActionButton, setOnSearch, setSearch, resetHeader]);

  const openEditModal = (user) => {
    // Resolve current role from API role map first, then fallback from current row data.
    const currentRoles = userRolesMap?.[user.id];
    const fallbackRole = ROLE_LABEL_TO_ID[user.roleLabel] || (String(user.role || "").toLowerCase() === "admin" ? "Admin" : "User");

    setSelectedUser(user);
    setCheckedRoles(Array.isArray(currentRoles) && currentRoles.length ? [currentRoles[0]] : [fallbackRole]);
    setEditForm({
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      userName: user.userName || user.username || "",
      password: "",
    });
    setIsEditOpen(true);
  };

  const handleCreate = async () => {
    if (!createForm.email || !createForm.userName || !createForm.password) {
      toast.error("Email, tên đăng nhập, mật khẩu là bắt buộc.");
      return;
    }
    setSaving(true);
    try {
      await createUserWithRoles(createForm, checkedRoles.length ? checkedRoles : ["User"]);
      setCreateForm(EMPTY_FORM);
      setCheckedRoles(["User"]);
      setIsCreateOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Không thể tạo tài khoản.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedUser?.id) return;
    setSaving(true);
    try {
      // Update account profile fields; password is optional when not provided.
      const payload = {
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        userName: editForm.userName,
      };
      if (editForm.password) payload.password = editForm.password;

      await updateUserAccount(selectedUser.id, payload);
      await updateUserRoles(selectedUser.id, checkedRoles);
      setIsEditOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể cập nhật tài khoản.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser?.id) return;
    if (!window.confirm(`Xóa tài khoản "${selectedUser.fullName}"?`)) return;
    setSaving(true);
    try {
      await deleteUser(selectedUser.id);
      setIsEditOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể xóa tài khoản.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading text="Đang tải danh sách người dùng..." />;

  return (
    <>
      <UsersPageLayout users={users} currentPage={currentPage} setCurrentPage={setCurrentPage} totalUsers={totalUsers} pageSize={pageSize} onEditRoles={openEditModal} />

      <UserAccountModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Tạo tài khoản"
        form={createForm}
        setForm={setCreateForm}
        roleNames={roleNames}
        checkedRoles={checkedRoles}
        setCheckedRoles={setCheckedRoles}
        onSubmit={handleCreate}
        saving={saving}
        submitLabel="Tạo tài khoản"
      />

      <UserAccountModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Sửa tài khoản: ${selectedUser?.fullName || ""}`}
        form={editForm}
        setForm={setEditForm}
        roleNames={roleNames}
        checkedRoles={checkedRoles}
        setCheckedRoles={setCheckedRoles}
        onSubmit={handleUpdate}
        saving={saving}
        submitLabel="Lưu thay đổi"
        showDelete
        onDelete={handleDelete}
      />
    </>
  );
}
