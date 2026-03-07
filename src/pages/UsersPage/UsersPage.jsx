import { useState, useEffect } from 'react';

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
} from 'lucide-react';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Loading from '../../components/ui/Loading';
import userService from '../../services/userService';

// ============================================
// MOCK DATA — Dùng khi chưa có backend
// ============================================
const MOCK_USERS = [
  {
    id: 1,
    fullName: 'Nguyễn Văn Khải',
    email: 'khai.nv@msparts.vn',
    username: 'admin_kho',
    role: 'admin',
    roleLabel: 'Quản trị viên',
    isActive: true,
  },
  {
    id: 2,
    fullName: 'Lê Minh Tú',
    email: 'tu.lm@msparts.vn',
    username: 'nv_kho_01',
    role: 'staff',
    roleLabel: 'Nhân viên',
    isActive: true,
  },
  {
    id: 3,
    fullName: 'Phạm Thu Hà',
    email: 'ha.pt@msparts.vn',
    username: 'nv_banhang_02',
    role: 'staff',
    roleLabel: 'Nhân viên',
    isActive: false,
  },
  {
    id: 4,
    fullName: 'Trần Đức Duy',
    email: 'duy.td@msparts.vn',
    username: 'duy_warehouse',
    role: 'staff',
    roleLabel: 'Nhân viên',
    isActive: true,
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalUsers = 24; // Giả lập tổng số user

  /**
   * Gọi API lấy danh sách user
   */
  useEffect(() => {
    const fetchUsers = async () => {
      console.log('[UsersPage] Bắt đầu lấy danh sách người dùng...');
      try {
        const data = await userService.getAll();
        console.log('[UsersPage] Dữ liệu nhận được từ userService:', data);
        
        let userList = Array.isArray(data) ? data : (data.data || data.items || []);
        
        // Map dữ liệu từ API: { id, email, phoneNumber, firstName, lastName, userName }
        const mappedUsers = userList.map(u => ({
          id: u.id,
          fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'N/A',
          username: u.userName || 'N/A',
          email: u.email || '',
          phoneNumber: u.phoneNumber || '',
          role: u.role || 'staff',
          roleLabel: u.roleLabel || (u.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'),
          isActive: u.isActive !== undefined ? u.isActive : true
        }));

        console.log('[UsersPage] Danh sách user sau khi map:', mappedUsers);
        setUsers(mappedUsers);
      } catch (error) {
        console.error('[UsersPage] Lỗi khi lấy danh sách user:', error);
        console.info('👤 Sử dụng mock data cho Users (API lỗi hoặc chưa kết nối)');
        setUsers(MOCK_USERS);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Lọc user theo search (Thêm bảo vệ tránh crash khi trường dữ liệu bị null)
  const filteredUsers = users.filter((u) => {
    const searchLower = search.toLowerCase();
    const fullName = (u.fullName || '').toLowerCase();
    const username = (u.username || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const phoneNumber = (u.phoneNumber || '').toLowerCase();

    return fullName.includes(searchLower) || 
           username.includes(searchLower) || 
           email.includes(searchLower) ||
           phoneNumber.includes(searchLower);
  });

  if (loading) return <Loading text="Đang tải danh sách người dùng..." />;

  return (
    <div
      className="space-y-6 animate-fadeInUp"
    >
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <nav className="flex text-sm text-slate-500 mb-2">
            <a href="#" className="hover:text-primary">Trang chủ</a>
            <span className="mx-2">/</span>
            <span className="text-slate-900 font-medium">Người dùng</span>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900">Quản lý Người dùng</h1>
        </div>
        <Button icon={<Plus size={18} />}>
          Thêm người dùng
        </Button>
      </div>

      {/* ===== SEARCH & FILTER BAR ===== */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Tìm kiếm theo tên đăng nhập hoặc vai trò..."
            className="w-full md:w-96"
          />
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="secondary" icon={<Filter size={18} className="text-slate-400" />}>
              Bộ lọc
            </Button>
            <Button variant="secondary" icon={<FileDown size={18} className="text-slate-400" />}>
              Xuất Excel
            </Button>
          </div>
        </div>
      </div>

      {/* ===== USER TABLE ===== */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên đăng nhập</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Số điện thoại</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== PAGINATION ===== */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-slate-500">
            Hiển thị{' '}
            <span className="font-medium text-slate-900">1 - {filteredUsers.length}</span>{' '}
            trong tổng số{' '}
            <span className="font-medium text-slate-900">{totalUsers}</span> người dùng
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-white disabled:opacity-50 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3.5 py-1.5 rounded-lg font-medium text-sm transition-all ${
                  currentPage === page
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="text-slate-400 mx-1">...</span>
            <button
              onClick={() => setCurrentPage(6)}
              className="px-3.5 py-1.5 rounded-lg text-slate-600 font-medium text-sm hover:bg-slate-100 transition-all"
            >
              6
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ===== SYSTEM INFO CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard
          icon={<Shield size={20} className="text-primary" />}
          title="Bảo mật hệ thống"
          description="Lần cuối kiểm tra định kỳ phân quyền người dùng là 2 ngày trước."
          colorClass="bg-primary/5 border-primary/20"
          titleColorClass="text-primary"
        />
        <InfoCard
          icon={<UserCheck size={20} className="text-emerald-600" />}
          title="Đang trực tuyến"
          description="Có 12 nhân viên hiện đang đăng nhập và làm việc trên hệ thống."
          colorClass="bg-emerald-50 border-emerald-100"
          titleColorClass="text-emerald-600"
        />
        <InfoCard
          icon={<History size={20} className="text-amber-600" />}
          title="Nhật ký hoạt động"
          description="Xem chi tiết các thay đổi cấu hình gần đây tại mục nhật ký hệ thống."
          colorClass="bg-amber-50 border-amber-100"
          titleColorClass="text-amber-600"
        />
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

/**
 * UserRow — Một dòng trong bảng user
 */
function UserRow({ user }) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      {/* Người dùng */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={user.fullName} size="sm" />
          <div>
            <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      </td>

      {/* Tên đăng nhập */}
      <td className="px-6 py-4 text-sm font-medium text-slate-600">
        {user.username}
      </td>

      {/* Số điện thoại */}
      <td className="px-6 py-4 text-sm text-slate-600">
        {user.phoneNumber || '—'}
      </td>

      {/* Vai trò */}
      <td className="px-6 py-4">
        <Badge variant={user.role === 'admin' ? 'blue' : 'gray'}>
          {user.roleLabel}
        </Badge>
      </td>

      {/* Trạng thái */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              user.isActive ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          />
          <span
            className={`text-sm font-medium ${
              user.isActive ? 'text-emerald-600' : 'text-slate-500'
            }`}
          >
            {user.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
          </span>
        </div>
      </td>

      {/* Thao tác */}
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button
            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
            title="Chỉnh sửa"
          >
            <Edit size={18} />
          </button>
          {user.isActive ? (
            <button
              className="p-1.5 text-slate-400 hover:text-accent-red hover:bg-red-50 rounded-lg transition-all"
              title="Vô hiệu hóa"
            >
              <Ban size={18} />
            </button>
          ) : (
            <button
              className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-all"
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

/**
 * InfoCard — Thẻ thông tin hệ thống
 */
function InfoCard({ icon, title, description, colorClass, titleColorClass }) {
  return (
    <div className={`p-4 border rounded-xl flex items-start gap-3 ${colorClass}`}>
      {icon}
      <div>
        <h4 className={`text-sm font-semibold ${titleColorClass}`}>{title}</h4>
        <p className="text-xs text-slate-600 mt-1">{description}</p>
      </div>
    </div>
  );
}
