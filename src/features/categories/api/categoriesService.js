import api from '../../../lib/axios';
import { categories as mockCategories } from '../../../utils/mockData';

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
    try {
      const response = await api.get('/Categories/all');
      return response.data;
    } catch (error) {
      console.warn('[categoryService] Fallback to mockData for getAll');
      return mockCategories;
    }
  },

  /**
   * Lấy chi tiết thông tin một danh mục theo ID
   * GET /api/Categories/{id}
   * @param {string|number} id - ID của danh mục
   * @returns {Promise<Object>}
   */
  async getById(id) {
    try {
      const response = await api.get(`/Categories/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`[categoryService] Fallback to mockData for getById(${id})`);
      return mockCategories.find(c => c.id === Number(id)) || null;
    }
  },

  /**
   * Lọc và tìm kiếm danh mục
   * GET /api/Categories/filter
   * @param {Object} params - Các tham số lọc { filter, pageIndex, pageSize }
   * @returns {Promise<Object>}
   */
  async filter(params = {}) {
    try {
      const response = await api.get('/Categories/filter', { params });
      return response.data;
    } catch (error) {
      console.warn('[categoryService] Fallback to mockData for filter');
      const { filter, pageIndex = 1, pageSize = 10 } = params;
      
      let items = [...mockCategories];
      
      // Lọc theo từ khóa
      if (filter && filter.trim()) {
        const keyword = filter.toLowerCase();
        items = items.filter(c => 
          c.name.toLowerCase().includes(keyword) || 
          c.seoDescription?.toLowerCase().includes(keyword)
        );
      }
      
      // Phân trang
      const start = (pageIndex - 1) * pageSize;
      const end = start + pageSize;
      
      return {
        items: items.slice(start, end),
        totalCount: items.length
      };
    }
  },

  /**
   * Lấy danh sách sản phẩm thuộc về một danh mục cụ thể
   * GET /api/Categories/{id}/products
   * @param {string|number} id - ID của danh mục
   * @returns {Promise<Array>}
   */
  async getProductsByCategory(id) {
    try {
      const response = await api.get(`/Categories/${id}/products`);
      return response.data;
    } catch (error) {
      console.warn(`[categoryService] Fallback to mockData for getProductsByCategory(${id})`);
      return [];
    }
  }
};

export default categoryService;
