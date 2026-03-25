import api from '../../../utils/api';

const authService = {
  async login (username, password) {
    try {
      const response = await api.post('/Authentication/login', {
        userName: username,
        password: password
      })

      // Hỗ trợ chuyển đổi do Backend ASP.NET Core thường trả về PascalCase hoặc camelCase
      const accessToken = 
        response.data.token || 
        response.data.Token ||
        response.data.accessToken ||
        response.data.AccessToken;
      
      const refeshToken = 
        response.refreshToken ||
        response.RefreshToken;

      let user = response.data.user || response.data.User;

      if (!user && accessToken) {
        user = { username };
      }

      if (!accessToken) {
        throw new Error('Server không trả về token.')
      }

      // Lưu vào localStorage để dùng cho các request tiếp theo
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Mục đính để gia hạn đăng nhập
      if ( refeshToken ) {
        localStorage.setItem('refreshToken', refeshToken);
      }

      return { accessToken, refeshToken, user }; 
      } catch ( error ) {
        throw error;
      }
    },

  // POST refresh-token 
  async refreshToken() {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');

      if (!storedRefreshToken) {
        throw new Error('Không có refresh token. Đăng nhập lại');
      }

      const response = await api.post('/Authentication/refresh-token', {
        refreshToken : storedRefreshToken
      }) ;

      const newAccessToken =
        response.data.token       ||
        response.data.Token       ||
        response.data.accessToken ||
        response.data.AccessToken;

      const newRefreshToken =
        response.data.refreshToken ||
        response.data.RefreshToken;

      if (!newAccessToken) {
        throw new Error('Không nhận được token từ server');
      }
      
      localStorage.setItem('accessToken', newAccessToken);

      if ( newRefreshToken) {
        localStorage.setItem('refreshToken', newAccessToken);
      }

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch ( error) {
      authService.clearSession();
      throw error;
    }
  }, 

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/Authentication/change-password', {
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
      return response.data;

    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      await api.post('/Authentication/logout', {
        refreshToken: refreshToken,
      });

    } catch (error) {
      console.warn('Logout API lỗi, vẫn xóa session local:', error.message);
    } finally {
      authService.clearSession();
    }
  },

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

};

export default authService;