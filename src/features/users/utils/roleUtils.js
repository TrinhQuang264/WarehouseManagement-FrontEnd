export const ROLE_LABEL_TO_ID = {
  "Quản lý kho": "Admin",
  "Nhân viên kho": "User",
};

export const ROLE_ID_TO_LABEL = {
  Admin: "Quản lý kho",
  User: "Nhân viên kho",
};

export function getRoleLabel(roleId) {
  return ROLE_ID_TO_LABEL[roleId] || roleId;
}

