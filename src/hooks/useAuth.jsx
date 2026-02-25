/**
 * useAuth.js — Custom hook quản lý xác thực người dùng
 *
 * LUỒNG:
 * 1. AuthProvider bọc toàn bộ app, cung cấp context
 * 2. Khi app khởi động → kiểm tra localStorage
 * 3. Component con gọi useAuth() để lấy { user, login, logout, isAuthenticated }
 *
 * IMPORT: Sử dụng authService từ folder services/ (không phải utils/)
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';

// React Context để chia sẻ auth state
const AuthContext = createContext(null);

/**
 * AuthProvider — Bọc app, cung cấp auth state cho toàn bộ component tree
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khi app load → kiểm tra localStorage
  useEffect(() => {
    console.log('[AuthProvider] Kiểm tra thông tin user từ localStorage...');
    const storedUser = authService.getStoredUser();
    if (storedUser && authService.isAuthenticated()) {
      console.log('[AuthProvider] Đã tìm thấy user trong localStorage:', storedUser);
      setUser(storedUser);
    } else {
      console.log('[AuthProvider] Không tìm thấy user hoặc chưa đăng nhập.');
    }
    setLoading(false);
  }, []);

  // Đăng nhập
  const login = useCallback(async (username, password) => {
    console.log('[AuthProvider] Bắt đầu gọi login()...');
    const { user: userData } = await authService.login(username, password);
    console.log('[AuthProvider] Login thành công, cập nhật state user...');
    setUser(userData);
    return userData;
  }, []);

  // Đăng xuất
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — Hook lấy auth context
 * @returns {{ user, login, logout, isAuthenticated, loading }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong <AuthProvider>');
  }
  return context;
}
