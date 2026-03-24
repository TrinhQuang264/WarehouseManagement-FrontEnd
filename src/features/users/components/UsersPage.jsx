import {
  Plus,
  Filter,
  FileDown,
  Edit,
  Ban,
  CheckCircle,
  Shield,
  UserCheck,
  History,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect } from "react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Avatar from "../../../components/ui/Avatar";
import Loading from "../../../components/ui/Loading";
import DataTableCard from "../../../components/ui/DataTableCard.jsx";
import PaginationBar from "../../../components/ui/PaginationBar.jsx";
import { useUsers } from "../hooks/useUsers.jsx";
import { useHeader } from "../../../contexts/HeaderContext";
import "../styles/Users.css";
import { Link } from "react-router-dom";

export default function UsersPage() {
  const { users, loading, setSearch, currentPage, setCurrentPage, totalUsers } =
    useUsers();

  const { setActionButton, setOnSearch, resetHeader } = useHeader();

  // Set header configuration on mount
  useEffect(() => {
    setActionButton({
      label: "Thêm người dùng",
      icon: <Plus size={18} />,
      onClick: () => alert("Chức năng thêm người dùng"),
      searchPlaceholder: "Tìm kiếm theo tên đăng nhập hoặc vai trò...",
      className:
        "shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]",
    });

    setOnSearch(setSearch);

    // Cleanup on unmount
    return () => resetHeader();
  }, [setActionButton, setOnSearch, setSearch, resetHeader]);

  if (loading) return <Loading text="Đang tải danh sách người dùng..." />;

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2">
            <Link to="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 dark:text-white font-medium">
              Tài khoản
            </span>
          </nav>
        </div>
      </div>

      <div className="search-filter-bar">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="secondary"
              icon={<Filter size={18} className="text-slate-400" />}
            >
              Bộ lọc
            </Button>
            <Button
              variant="secondary"
              icon={<FileDown size={18} className="text-slate-400" />}
            >
              Xuất Excel
            </Button>
          </div>
        </div>
      </div>

      <DataTableCard>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <th className="table-th px-6">Người dùng</th>
                <th className="table-th px-6">Tên đăng nhập</th>
                <th className="table-th px-6">Số điện thoại</th>
                <th className="table-th px-6">Vai trò</th>
                <th className="table-th px-6">Trạng thái</th>
                <th className="table-th px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      </DataTableCard>

      <PaginationBar
        info={
          <span className="pagination-info">
            Hiển thị{" "}
            <span className="font-medium text-slate-900 dark:text-white">
              1 - {users.length}
            </span>{" "}
            trong tổng số{" "}
            <span className="font-medium text-slate-900 dark:text-white">
              {totalUsers}
            </span>{" "}
            người dùng
          </span>
        }
      >
        <div className="pagination-controls">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="pagination-btn"
          >
            <ChevronLeft size={16} />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`pagination-page-btn ${currentPage === page ? "pagination-page-btn-active" : ""}`}
            >
              {page}
            </button>
          ))}
          <span className="text-slate-400 mx-1">...</span>
          <button
            onClick={() => setCurrentPage(6)}
            className="pagination-page-btn"
          >
            6
          </button>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="pagination-btn"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </PaginationBar>
      </div>
  );
}

function UserRow({ user }) {
  return (
    <tr className="table-row-hover">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={user.fullName} size="sm" />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {user.fullName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">
        {user.username}
      </td>

      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
        {user.phoneNumber || "—"}
      </td>

      {/* Vai trò */}
      <td className="px-6 py-4">
        <Badge variant={user.role === "admin" ? "blue" : "gray"}>
          {user.roleLabel}
        </Badge>
      </td>

      {/* Trạng thái */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              user.isActive ? "bg-emerald-500" : "bg-slate-300"
            }`}
          />
          <span
            className={`text-sm font-medium ${
              user.isActive ? "text-emerald-600" : "text-slate-500"
            }`}
          >
            {user.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
          </span>
        </div>
      </td>

      {/* Thao tác */}
      <td className="px-6 py-4 text-right">
        <div className="action-buttons-group justify-end">
          <button
            className="action-btn text-slate-400 hover:text-primary"
            title="Chỉnh sửa"
          >
            <Edit size={18} />
          </button>
          {user.isActive ? (
            <button
              className="action-btn text-slate-400 hover:text-accent-red hover:bg-red-50"
              title="Vô hiệu hóa"
            >
              <Ban size={18} />
            </button>
          ) : (
            <button
              className="action-btn text-primary hover:bg-primary/10"
              title="Kích hoạt"
            >
              <CheckCircle size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
