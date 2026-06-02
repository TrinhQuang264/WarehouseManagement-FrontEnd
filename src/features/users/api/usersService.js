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
  async getAll() {
    return this.getAllUsers();
  },

  /**
   * GET /Users/filter - Tìm kiếm user theo từ khóa
   */
  async search(params = {}) {
    const response = await api.get('/Users/filter', {
      params: { isDeleted: false, ...params },
    });
    return response.data;
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

  async createUser(data) {
    const response = await api.post('/Users', data);
    return response.data;
  },

  async getAllRoles() {
    const response = await api.get('/Roles/all');
    return response.data;
  },

  async getUserRoles(id) {
    const response = await api.get(`/Users/${id}/roles`);
    return response.data;
  },

  async replaceUserRoles(id, roleNames) {
    const response = await api.put(`/Users/${id}/roles`, { roleNames });
    return response.data;
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
  /**
   * PUT /Users/{id}/toggle-active - Khóa/mở khóa tài khoản
   */
  async toggleActive(id) {
    try {
      const response = await api.put(`/Users/${id}/toggle-active`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default usersService;
