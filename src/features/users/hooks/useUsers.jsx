import { useState, useEffect, useMemo, useCallback } from "react";
import userService from "../api/usersService";
import toast from "../../../utils/toast";

const ROLE_LABEL_MAP = {
  Admin: "Quản lý kho",
  User: "Nhân viên kho",
};

function toRoleLabel(roleName) {
  return ROLE_LABEL_MAP[roleName] || roleName;
}

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [userRolesMap, setUserRolesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roles, setRoles] = useState([]);
  const totalUsers = 24;

  const fetchUsers = useCallback(async () => {
    try {
      const data = await userService.getAll();
      const userList = Array.isArray(data)
        ? data
        : data.data || data.items || [];

      const mappedUsers = userList.map((u) => ({
        id: u.id,
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        fullName: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "N/A",
        username: u.userName || "N/A",
        userName: u.userName || "",
        email: u.email || "",
        phoneNumber: u.phoneNumber || "",
        role: u.role || "staff",
        roleLabel:
          u.roleLabel || (u.role === "admin" ? "Quản trị viên" : "Nhân viên"),
        isActive: u.isActive !== undefined ? u.isActive : true,
      }));

      setUsers(mappedUsers);

      const roleEntries = await Promise.all(
        mappedUsers.map(async (u) => {
          try {
            const roleNames = await userService.getUserRoles(u.id);
            return [u.id, Array.isArray(roleNames) ? roleNames : []];
          } catch {
            return [u.id, []];
          }
        }),
      );
      const nextRoleMap = Object.fromEntries(roleEntries);
      setUserRolesMap(nextRoleMap);
      setUsers((prev) =>
        prev.map((u) => {
          const rolesOfUser = nextRoleMap[u.id] || [];
          return {
            ...u,
            role: rolesOfUser[0]?.toLowerCase() || u.role,
            roleLabel: rolesOfUser.length
              ? rolesOfUser.map(toRoleLabel).join(", ")
              : u.roleLabel,
          };
        }),
      );
    } catch (error) {
      console.error("[useUsers] Lỗi API:", error);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const data = await userService.getAllRoles();
      const roleList = Array.isArray(data) ? data : [];
      setRoles(roleList);
    } catch (error) {
      console.error("[useUsers] Lỗi load roles:", error);
      setRoles([]);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([fetchUsers(), fetchRoles()]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchUsers, fetchRoles]);

  const createUserWithRoles = useCallback(
    async (payload, roleNames = ["User"]) => {
      await userService.createUser(payload);
      const usersData = await userService.getAll();
      const userList = Array.isArray(usersData)
        ? usersData
        : usersData.data || usersData.items || [];
      const createdUser = userList.find(
        (u) =>
          String(u.email || "").toLowerCase() ===
          String(payload.email || "").toLowerCase(),
      );
      if (!createdUser?.id) {
        throw new Error("Không tìm thấy user vừa tạo để gán role.");
      }
      await userService.replaceUserRoles(createdUser.id, roleNames);
      await fetchUsers();
      toast.success("Tạo tài khoản thành công");
      return createdUser;
    },
    [fetchUsers],
  );

  const updateUserRoles = useCallback(
    async (id, roleNames) => {
      const validRoleNames = new Set((roles || []).map((r) => r.name || r.id));
      const safeRoles = (roleNames || []).filter((r) => validRoleNames.has(r));
      await userService.replaceUserRoles(id, safeRoles);
      setUserRolesMap((prev) => ({ ...prev, [id]: safeRoles }));
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                role: safeRoles[0]?.toLowerCase() || u.role,
                roleLabel: safeRoles.length
                  ? safeRoles.map(toRoleLabel).join(", ")
                  : "Chưa có vai trò",
              }
            : u,
        ),
      );
      toast.success("Cập nhật vai trò thành công");
    },
    [roles, fetchUsers],
  );

  const updateUserAccount = useCallback(
    async (id, payload) => {
      await userService.updateUser(id, payload);
      await fetchUsers();
      toast.success("Cập nhật tài khoản thành công");
    },
    [fetchUsers],
  );

  const deleteUser = useCallback(
    async (id) => {
      await userService.deleteUser(id);
      await fetchUsers();
      toast.success("Xóa tài khoản thành công");
    },
    [fetchUsers],
  );

  const filteredUsers = useMemo(() => {
    const searchLower = String(search ?? "")
      .trim()
      .toLowerCase();

    if (!searchLower) {
      return users;
    }

    return users.filter((u) => {
      return [u.fullName, u.username, u.email, u.phoneNumber].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(searchLower),
      );
    });
  }, [users, search]);

  const handleSearch = useCallback((query) => {
    setSearch(String(query ?? ""));
  }, []);

  return {
    users: filteredUsers,
    loading,
    search,
    setSearch: handleSearch,
    currentPage,
    setCurrentPage,
    totalUsers,
    roles,
    createUserWithRoles,
    updateUserAccount,
    updateUserRoles,
    deleteUser,
    userRolesMap,
  };
}
