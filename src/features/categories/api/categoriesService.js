import api from '../../../lib/axios';

/**
 * Service quản lý các yêu cầu API liên quan đến Danh mục sản phẩm
 */
const categoryService = {
  /**
   * Lấy danh sách tất cả các danh mục
   * GET /api/Categories/all
   * @returns {Promise<Array>}
   */
  async getAll() {
    const response = await api.get('/Categories/all');
    return response.data;
  },

  /**
   * Lấy chi tiết thông tin một danh mục theo ID
   * GET /api/Categories/{id}
   * @param {string|number} id - ID của danh mục
   * @returns {Promise<Object>}
   */
  async getById(id) {
    const response = await api.get(`/Categories/${id}`);
    return response.data;
  },

  /**
   * Lọc và tìm kiếm danh mục
   * GET /api/Categories/filter
   * @param {Object} params - Các tham số lọc { search, page, pageSize }
   * @returns {Promise<Object>}
   */
  async filter(params = {}) {
    const response = await api.get('/Categories/filter', { params });
    return response.data;
  },

  /**
   * Lấy danh sách sản phẩm thuộc về một danh mục cụ thể
   * GET /api/Categories/{id}/products
   * @param {string|number} id - ID của danh mục
   * @returns {Promise<Array>}
   */
  async getProductsByCategory(id) {
    const response = await api.get(`/Categories/${id}/products`);
    return response.data;
  }
};

export default categoryService;
