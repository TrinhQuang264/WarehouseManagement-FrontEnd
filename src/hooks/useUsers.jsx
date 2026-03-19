import { useState, useEffect, useMemo } from 'react';
import userService from '../services/userService';

// MOCK DATA — Dùng khi chưa có backend
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

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalUsers = 24; // Giả lập tổng số user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll();
        let userList = Array.isArray(data) ? data : (data.data || data.items || []);
        
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

        setUsers(mappedUsers);
      } catch (error) {
        console.error('[useUsers] Lỗi API:', error);
        setUsers(MOCK_USERS);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const searchLower = search.toLowerCase();
      return (u.fullName || '').toLowerCase().includes(searchLower) || 
             (u.username || '').toLowerCase().includes(searchLower) || 
             (u.email || '').toLowerCase().includes(searchLower) ||
             (u.phoneNumber || '').toLowerCase().includes(searchLower);
    });
  }, [users, search]);

  return {
    users: filteredUsers,
    loading,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    totalUsers
  };
}
