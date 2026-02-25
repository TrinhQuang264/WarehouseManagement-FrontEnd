/**
 * authService.js — Service xử lý xác thực người dùng
 *
 * Đây là bản đã chuyển từ utils/ sang services/ (nơi tập trung các service)
 *
 * API ENDPOINTS (ASP.NET Core):
 *  - POST /api/auth/login   → Đăng nhập, trả về { token, user }
 *  - GET  /api/auth/me      → Lấy thông tin user hiện tại (từ token)
 */
import api from '../utils/api';

const authService = {
  /**
   * Đăng nhập
   * @param {string} username - Tên đăng nhập
   * @param {string} password - Mật khẩu
   * @returns {Promise<{ token: string, user: object }>}
   */
  async login(username, password) {
    console.log('[authService] Bắt đầu gọi API login cho user:', username);
    try {
      const response = await api.post('/Authentication/Login', { userName: username, password });
      console.log('[authService] API login thành công. Toàn bộ response.data:', response.data);
      
      // Hỗ trợ cả camelCase và PascalCase (phổ biến trong ASP.NET Core)
      const token = response.data.token || response.data.accessToken || response.data.Token || response.data.AccessToken;
      let user = response.data.user || response.data.User;

      // Nếu không có user trong response nhưng có token, tạo mock user hoặc lấy tử profile
      if (!user && token) {
        console.warn('[authService] Không tìm thấy object "user" trong response. Sử dụng thông tin mặc định.');
        user = { username, role: 'Admin' }; // Hoặc thông tin tối thiểu
      }

      console.log('[authService] Dữ liệu sau khi trích xuất:', { token: token ? '***' : 'Missing', user });

      if (!token) {
        throw new Error('Không nhận được mã xác thực (Token) từ server.');
      }

      // Lưu token & user vào localStorage
      console.log('[authService] Lưu accessToken và user vào localStorage...');
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { token, user };
    } catch (error) {
      console.error('[authService] Lỗi khi xử lý login:', error);
      throw error;
    }
  },

  /**
   * Đăng xuất — xóa token và user khỏi localStorage
   */
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  /**
   * Lấy thông tin user hiện tại từ server
   * @returns {Promise<object>} user data
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Kiểm tra xem có đang đăng nhập không (dựa trên token)
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Lấy user từ localStorage (không gọi API)
   * @returns {object|null}
   */
  getStoredUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};

export default authService;
