import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import authService from "../api/authService";
import { decodeJWT } from "../../../utils/jwt";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Silent Refresh Scheduler
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const decoded = decodeJWT(token);
      if (!decoded || !decoded.exp) return;

      const expirationTime = decoded.exp * 1000; // exp in seconds
      const currentTime = Date.now();
      const timeRemaining = expirationTime - currentTime;

      // Nếu token còn hạn ít hơn 1.5 phút (90000ms), tự động refresh ngầm
      if (timeRemaining > 0 && timeRemaining < 90000) {
        console.log("[Silent Refresh] Access Token sắp hết hạn, đang làm mới ngầm...");
        try {
          await authService.refreshToken();
        } catch (err) {
          console.warn("[Silent Refresh] Không thể làm mới token ngầm:", err.message);
        }
      }
    };

    // Chạy kiểm tra định kỳ mỗi 15 giây
    const interval = setInterval(checkAndRefreshToken, 15000);
    checkAndRefreshToken(); // Kiểm tra ngay lập tức khi load app

    return () => clearInterval(interval);
  }, [user]);

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
      const { user: loggedInUser } = await authService.login(
        username,
        password,
      );
      setUser(loggedInUser);
      return { success: true };
    } catch (err) {
      const isAuthError =
        err.response?.status === 400 || err.response?.status === 401;
      const message = isAuthError
        ? "Tài khoản hoặc mật khẩu không chính xác"
        : err.response?.data?.message ||
          "Tài khoản hoặc mật khẩu không chính xác";
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
      console.warn("Logout API lỗi:", err.message);
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
      console.warn("Refresh token thất bại:", err);
      setUser(null);
      setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return { success: false };
    }
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.changePassword(currentPassword, newPassword);
      return { success: true, message: "Đổi mật khẩu thành công." };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Đổi mật khẩu thất bại. Vui lòng thử lại.";
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const updateUser = useCallback((newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  }, []);

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
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth() phải được dùng bên trong <AuthProvider>.");
  }

  return context;
}
