import api from '../../../lib/axios';

/**
 * profileService - Service cho trang Profile cá nhân
 * Dùng API /Users/{id} để get/update profile
 * Dùng API /Authentication/change-password để đổi mật khẩu
 */
const profileService = {
  /**
   * GET /Users/{id} - Lấy thông tin profile theo userId
   */
  async getProfile(id) {
    try {
      console.log('[ProfileService] Gọi GET /Users/' + id);
      const response = await api.get(`/Users/${id}`);
      console.log('[ProfileService] Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[ProfileService] Lỗi getProfile:', error);
      throw error;
    }
  },

  /**
   * PUT /Users/{id} - Cập nhật thông tin profile
   */
  async updateProfile(id, data) {
    try {
      console.log('[ProfileService] Gọi PUT /Users/' + id, data);
      const response = await api.put(`/Users/${id}`, data);
      console.log('[ProfileService] Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[ProfileService] Lỗi updateProfile:', error);
      throw error;
    }
  },

  /**
   * POST /Authentication/change-password - Đổi mật khẩu
   */
  async changePassword(userName, currentPassword, newPassword, confirmPassword) {
    try {
      console.log('[ProfileService] Gọi POST /Authentication/change-password?userName=' + userName);
      
      const response = await api.post(`/Authentication/change-password?userName=${userName}`, {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });
      console.log('[ProfileService] Đổi mật khẩu thành công');
      return response.data;
    } catch (error) {
      console.error('[ProfileService] Lỗi changePassword:', error);
      throw error;
    }
  },
};

export default profileService;