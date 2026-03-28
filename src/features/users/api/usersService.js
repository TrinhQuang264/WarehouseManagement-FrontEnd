import api from '../../../lib/axios';

/**
 * usersService - Service cho quản lý Users (CRUD)
 * Dùng cho trang quản lý người dùng (/users)
 */
const usersService = {
  /**
   * GET /Users/all - Lấy danh sách tất cả users
   */
  async getAllUsers() {
    try {
      const response = await api.get('/Users/all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * GET /Users/{id} - Lấy thông tin user theo ID
   */
  async getUserById(id) {
    try {
      const response = await api.get(`/Users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * PUT /Users/{id} - Cập nhật thông tin user
   */
  async updateUser(id, data) {
    try {
      const response = await api.put(`/Users/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * DELETE /Users/{id} - Xóa user
   */
  async deleteUser(id) {
    try {
      const response = await api.delete(`/Users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default usersService;