import api from '../../../lib/axios';
import { getUsernameFromToken, getUserIdFromToken } from '../../../utils/jwt';

const authService = {
  
  // POST /Authentication/login
  async login(username, password) {
    try {
      const response = await api.post('/Authentication/login', {
        userName: username,
        password: password,
      });

      const responseData = response.data;
      const accessToken = responseData.accessToken;
      const refreshToken = responseData.refreshToken;

      if (!accessToken) {
        throw new Error('Server không trả về token.');
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const userId = getUserIdFromToken(accessToken);
      const jwtUserName = getUsernameFromToken(accessToken) || username;
      let user = { id: userId, userName: jwtUserName };
      try {
        if (userId) {
          const userResponse = await api.get(`/Users/${userId}`);
          const foundUser = userResponse.data;

          if (foundUser) {
            const firstName = foundUser.firstName || '';
            const lastName = foundUser.lastName || '';

            user = {
              ...foundUser,
              fullName: `${lastName} ${firstName}`.trim() || foundUser.userName,
            };
          }
        }
      } catch (userErr) {
        console.warn('[Login] Không thể lấy profile chi tiết:', userErr?.message);
        user.fullName = jwtUserName;
      }

      localStorage.setItem('user', JSON.stringify(user));
      console.log(`ĐĂNG NHẬP THÀNH CÔNG: ${user.fullName}`);    
      return { accessToken, refreshToken, user };
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      throw error;
    }
  },

  // POST /Authentication/refresh-token
  async refreshToken() {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');

      if (!storedRefreshToken) {
        throw new Error('Không có refresh token. Đăng nhập lại.');
      }

      const response = await api.post('/Authentication/refresh-token', {
        refreshToken: storedRefreshToken,
      });

      const newAccessToken = response.data.accessToken;
      const newRefreshToken = response.data.refreshToken;

      if (!newAccessToken) {
        throw new Error('Không nhận được token từ server.');
      }

      localStorage.setItem('accessToken', newAccessToken);

      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
      
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      authService.clearSession();
      throw error;
    }
  },

  // POST /Authentication/change-password
  async changePassword(userName, currentPassword, newPassword, confirmPassword) {
    try {
      const response = await api.post(`/Authentication/change-password?userName=${userName}`, {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      console.error('[authService] Lỗi changePassword:', error);
      throw error;
    }
  },

  // POST /Authentication/logout
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/Authentication/logout', {
        refreshToken,
      });
    } catch (error) {
      console.warn('Logout API lỗi, vẫn xóa session local:', error.message);
    } finally {
      authService.clearSession();
    }
  },

  // Helper functions
  clearSession() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  getStoredUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getAccessToken() {
    return localStorage.getItem('accessToken');
  },

  // Lấy userId từ localStorage hoặc giải mã JWT
  getUserId() {
    const user = authService.getStoredUser();
    if (user?.id || user?.Id) {
      return user.id || user.Id;
    }

    const token = authService.getAccessToken();
    return getUserIdFromToken(token);
  },
};

export default authService;