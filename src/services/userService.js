/**
 * userService.js — Service gọi API cho quản lý người dùng
 *
 * Tách riêng logic gọi API ra khỏi component.
 *
 * CÁCH DÙNG:
 *   import userService from '../services/userService';
 *   const users = await userService.getAll();
 */
import api from '../utils/api';

const userService = {
  /**
   * Lấy danh sách tất cả người dùng
   * GET /api/users?page=1&limit=10&search=keyword
   * @param {object} params - { page, limit, search }
   * @returns {Promise<{ data: Array, total: number }>}
   */
  async getAll(params = {}) {
    const response = await api.get('/Users', { params });
    return response.data;
  },

  /**
   * Lấy thông tin chi tiết 1 người dùng
   * GET /api/users/:id
   * @param {number} id
   * @returns {Promise<object>}
   */
  async getById(id) {
    const response = await api.get(`/Users/${id}`);
    return response.data;
  },

  /**
   * Tạo người dùng mới
   * POST /api/users
   * @param {object} userData - { fullName, email, username, password, role }
   * @returns {Promise<object>}
   */
  async create(userData) {
    const response = await api.post('/Users', userData);
    return response.data;
  },

  /**
   * Cập nhật thông tin người dùng
   * PUT /api/users/:id
   * @param {number} id
   * @param {object} userData
   * @returns {Promise<object>}
   */
  async update(id, userData) {
    const response = await api.put(`/Users/${id}`, userData);
    return response.data;
  },

  /**
   * Kích hoạt / vô hiệu hóa người dùng
   * PATCH /api/users/:id/toggle-status
   * @param {number} id
   * @returns {Promise<object>}
   */
  async toggleStatus(id) {
    const response = await api.patch(`/Users/${id}/toggle-status`);
    return response.data;
  },

  /**
   * Xóa người dùng
   * DELETE /api/users/:id
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    await api.delete(`/Users/${id}`);
  },
};

export default userService;
