import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import authService from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const isLoggedIn = authService.isAuthenticated();

    if (isLoggedIn && storedUser) {
      setUser(storedUser);
    }

    setIsInitialized(true);
  }, []);

  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null); 

    try {
      const { user: loggedInUser } = await authService.login(username, password);
      setUser(loggedInUser);
      return { success: true };

    } catch (err) {
      const isAuthError = err.response?.status === 400 || err.response?.status === 401;
      const message = isAuthError 
        ? 'Tài khoản hoặc mật khẩu không chính xác'
        : (err.response?.data?.message || err.response?.data?.Message || 'Tài khoản hoặc mật khẩu không chính xác');

      setError(message);
      return { success: false, message };

    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await authService.logout();

    } catch (err) {
      console.warn('Logout API lỗi:', err.message);

    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);


  const refreshToken = useCallback(async () => {
    try {
      await authService.refreshToken();
      return { success: true };

    } catch (err) {
      setUser(null);
      setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      return { success: false };
    }
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.changePassword(currentPassword, newPassword);
      return { success: true, message: 'Đổi mật khẩu thành công.' };

    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.Message ||
        err.message ||
        'Đổi mật khẩu thất bại. Vui lòng thử lại.';

      setError(message);
      return { success: false, message };

    } finally {
      setIsLoading(false);
    }
  }, []);


  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    error,
    login,
    logout,
    refreshToken,
    changePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth() phải được dùng bên trong <AuthProvider>.');
  }

  return context;
}