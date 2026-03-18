import api from '../utils/api';

const authService = {
  async login(username, password) {
    console.log('[authService] Bắt đầu gọi API login cho user:', username);

    // FIX CỨNG: Nếu là admin/123456 thì cho đăng nhập ngay bằng mock data
    if (username === 'admin' && password === '123456') {
      console.log('[authService] Bypass login bằng tài khoản admin mock.');
      const token = 'mock_admin_token_do_not_use_in_prod';
      const user = { username: 'admin', fullName: 'Nguyễn Văn An', role: 'Quản lý kho', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw2aqesUY60aEk721ehQYmqYVqVDEJjW3hjZPjorwqulh-dGnDlhyx4Pe5XuIpr4W-QkQ0G6cTTQTWv-78XEm99L_vcr2TSVUxgxSV1DycA-EsSEtmCkQFN3sjtUZ2SAkWM-dTRxr--CnS1KlI3ZWtn1M5SNxtXhL-EwpNiyF_N18ChDS6OLbnzysGtPinpUhT0ony22hA3A3lDb6ZAmPZ6u1XREyG8tHCrUxY-xxbAaNaSzA_T7KsUVs33raV5BVc8UuTibvNmXU' };
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    }

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
