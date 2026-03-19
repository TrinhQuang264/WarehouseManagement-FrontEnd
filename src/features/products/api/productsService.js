import api from '../../../lib/axios';

/**
 * Service quản lý các yêu cầu API liên quan đến Sản phẩm
 */
const productService = {
  /**
   * Lấy danh sách tất cả sản phẩm
   * GET /api/Products/all
   * @returns {Promise<Array>}
   */
  async getAll() {
    const response = await api.get('/Products/all');
    return response.data;
  },

  /**
   * Lấy thông tin chi tiết của một sản phẩm
   * GET /api/Products/get-detail/{id}
   * @param {string|number} id - ID của sản phẩm
   * @returns {Promise<Object>}
   */
  async getById(id) {
    const response = await api.get(`/Products/get-detail/${id}`);
    return response.data;
  },

  /**
   * Lấy danh sách sản phẩm theo danh mục
   * GET /api/Products/by-category/{categoryId}
   * @param {string|number} categoryId - ID của danh mục
   * @returns {Promise<Array>}
   */
  async getByCategory(categoryId) {
    const response = await api.get(`/Products/by-category/${categoryId}`);
    return response.data;
  },

  /**
   * Lọc và tìm kiếm sản phẩm theo các tiêu chí (tên, mã, v.v.)
   * GET /api/Products/filter
   * @param {Object} params - Các tham số lọc { search, page, pageSize, ... }
   * @returns {Promise<Object>}
   */
  async filter(params = {}) {
    const response = await api.get('/Products/filter', { params });
    return response.data;
  },

  /**
   * Lấy danh sách sản phẩm trong khoảng giá tiền
   * GET /api/Products/price-between
   * @param {number} minPrice - Giá thấp nhất
   * @param {number} maxPrice - Giá cao nhất
   * @returns {Promise<Array>}
   */
  async getPriceBetween(minPrice, maxPrice) {
    const response = await api.get('/Products/price-between', {
      params: { minPrice, maxPrice }
    });
    return response.data;
  },

  /**
   * Lấy bình luận của sản phẩm
   * GET /api/Products/{id}/comment
   * @param {string|number} id - ID của sản phẩm
   * @returns {Promise<Array>}
   */
  async getComments(id) {
    const response = await api.get(`/Products/${id}/comment`);
    return response.data;
  }
};

export default productService;
