/**
 * dashboardService.js — Service gọi API cho trang Dashboard
 *
 * Tách riêng logic gọi API ra khỏi component.
 * Component chỉ cần gọi service, không cần biết chi tiết API endpoint.
 *
 * CÁCH DÙNG:
 *   import dashboardService from '../services/dashboardService';
 *   const stats = await dashboardService.getStats();
 */
import api from '../utils/api';

const dashboardService = {
  /**
   * Lấy thống kê tổng quan
   * GET /api/dashboard/stats
   * @returns {Promise<{ totalInventory, lowStockCount, todayImport, todayExport }>}
   */
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
