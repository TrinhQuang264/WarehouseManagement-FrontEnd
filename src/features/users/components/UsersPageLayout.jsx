import { Link } from "react-router-dom";
import { Filter, FileDown } from "lucide-react";
import Button from "../../../components/ui/Button";
import DataTableCard from "../../../components/ui/DataTableCard.jsx";
import PaginationBar from "../../../components/ui/PaginationBar.jsx";
import UsersTable from "./UsersTable";

export default function UsersPageLayout({
  users,
  currentPage,
  setCurrentPage,
  totalUsers,
  pageSize,
  onEditRoles,
  onToggleActive,
}) {
  return (
    <div className="users-page">
      <div className="page-header">
        <nav className="flex text-sm text-slate-500 mb-2">
          <Link to="/" className="hover:text-primary transition-colors">
            Tổng quan
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-900  font-medium">Tài khoản</span>
        </nav>
      </div>
      <DataTableCard>
        <UsersTable
          users={users}
          onEditRoles={onEditRoles}
          onToggleActive={onToggleActive}
        />
      </DataTableCard>
      <PaginationBar
        currentPage={currentPage}
        pageSize={pageSize}
        totalCount={totalUsers}
        onPageChange={setCurrentPage}
        resourceName="người dùng"
      />
    </div>
  );
}
