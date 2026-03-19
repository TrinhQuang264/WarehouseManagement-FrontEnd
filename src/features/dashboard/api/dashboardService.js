import api from '../../../lib/axios';

const dashboardService = {
  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  /**
   * Lấy dữ liệu biểu đồ nhập/xuất theo thời gian
   * GET /api/dashboard/chart?period=7d
   * @param {string} period - Khoảng thời gian: '7d' | '30d'
   * @returns {Promise<Array<{ day, import, export }>>}
   */
  async getChartData(period = '7d') {
    const response = await api.get('/dashboard/chart', { params: { period } });
    return response.data;
  },

  /**
   * Lấy danh sách sản phẩm bán chạy
   * GET /api/dashboard/top-products?limit=10
   * @param {number} limit - Số lượng sản phẩm trả về
   * @returns {Promise<Array>}
   */
  async getTopProducts(limit = 10) {
    const response = await api.get('/dashboard/top-products', { params: { limit } });
    return response.data;
  },
};

export default dashboardService;
