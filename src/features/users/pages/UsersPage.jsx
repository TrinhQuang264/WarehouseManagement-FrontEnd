import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Loading from "../../../components/ui/Loading";
import { useHeader } from "../../../contexts/HeaderContext";
import { useUsers } from "../hooks/useUsers.jsx";
import { useAuth } from "../../auth/hooks/useAuth.jsx";
import UsersPageLayout from "../components/UsersPageLayout";
import UserAccountModal from "../components/UserAccountModal";
import { ROLE_LABEL_TO_ID } from "../utils/roleUtils";
import toast from "../../../utils/toast";
import "../styles/Users.css";

const EMPTY_FORM = {
  email: "",
  phoneNumber: "",
  fullName: "",
  userName: "",
  password: "",
};

export default function UsersPage() {
  const {
    users,
    loading,
    setSearch,
    currentPage,
    setCurrentPage,
    totalUsers,
    pageSize,
    roles,
    createUserWithRoles,
    updateUserAccount,
    updateUserActive,
    updateUserRoles,
    deleteUser,
    userRolesMap,
  } = useUsers();
  const { setActionButton, setOnSearch, resetHeader } = useHeader();
  const { user: currentUser } = useAuth();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [checkedRoles, setCheckedRoles] = useState(["User"]);
  const [saving, setSaving] = useState(false);

  const roleNames = useMemo(
    () => (roles || []).map((r) => r.name || r.id).filter(Boolean),
    [roles],
  );

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
    const fallbackRole =
      ROLE_LABEL_TO_ID[user.roleLabel] ||
      (String(user.role || "").toLowerCase() === "admin" ? "Admin" : "User");

    setSelectedUser(user);
    setCheckedRoles(
      Array.isArray(currentRoles) && currentRoles.length
        ? [currentRoles[0]]
        : [fallbackRole],
    );

    setEditForm({
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      fullName: user.fullName || "",
      userName: user.userName || user.username || "",
      password: "",
    });
    setIsEditOpen(true);
  };

  const handleCreate = async () => {
    if (
      !createForm.email ||
      !createForm.userName ||
      !createForm.password ||
      !createForm.fullName
    ) {
      toast.error("Họ và tên, Email, tên đăng nhập, mật khẩu là bắt buộc.");
      return;
    }
    setSaving(true);
    try {
      const nameParts = createForm.fullName.trim().split(/\s+/);
      const firstName = nameParts.pop() || "";
      const lastName = nameParts.join(" ") || "";

      const payload = {
        email: createForm.email,
        phoneNumber: createForm.phoneNumber,
        userName: createForm.userName,
        password: createForm.password,
        firstName,
        lastName,
      };

      await createUserWithRoles(
        payload,
        checkedRoles.length ? checkedRoles : ["User"],
      );
      setCreateForm(EMPTY_FORM);
      setCheckedRoles(["User"]);
      setIsCreateOpen(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Không thể tạo tài khoản.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedUser?.id) return;
    if (!editForm.fullName) {
      toast.error("Họ và tên là bắt buộc.");
      return;
    }
    setSaving(true);
    try {
      const nameParts = editForm.fullName.trim().split(/\s+/);
      const firstName = nameParts.pop() || "";
      const lastName = nameParts.join(" ") || "";

      // Update account profile fields; password is optional when not provided.
      const payload = {
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
        firstName,
        lastName,
        userName: editForm.userName,
      };
      if (editForm.password) payload.password = editForm.password;

      await updateUserAccount(selectedUser.id, payload);
      await updateUserRoles(selectedUser.id, checkedRoles);
      setIsEditOpen(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Không thể cập nhật tài khoản.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user) => {
    if (!user?.id) return;

    // Check if user is locking their own account
    if (currentUser && String(user.id) === String(currentUser.id)) {
      toast.error("Bạn không thể tự khóa tài khoản của chính mình!");
      return;
    }

    const message = user.isActive
      ? `Bạn có muốn mở khoá tài khoản "${user.fullName}" không?`
      : `Bạn có muốn khoá tài khoản "${user.fullName}" không?`;

    if (!window.confirm(message)) {
      return;
    }

    setSaving(true);
    try {
      await updateUserActive(user.id);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Không thể cập nhật trạng thái tài khoản.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser?.id) return;

    // Check if user is deleting their own account
    if (currentUser && String(selectedUser.id) === String(currentUser.id)) {
      toast.error("Bạn không thể tự xóa tài khoản của chính mình!");
      return;
    }

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
      <UsersPageLayout
        users={users}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalUsers={totalUsers}
        pageSize={pageSize}
        onEditRoles={openEditModal}
        onToggleActive={handleToggleActive}
      />

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
