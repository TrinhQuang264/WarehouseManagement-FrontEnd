import api from '../../../lib/axios';

const stockTransactionsService = {
  // GET /api/StockTransactions
  async getAll() {
    try {
      const response = await api.get('/StockTransactions');
      return response.data;
    } catch (error) {
      console.error('Error fetching all stock transactions:', error);
      throw error;
    }
  },

  // GET /api/StockTransactions/filter
  async filter(params = {}) {
    try {
      const response = await api.get('/StockTransactions/filter', { params });
      return response.data;
    } catch (error) {
      console.error('Error filtering stock transactions:', error);
      throw error;
    }
  }
};

export default stockTransactionsService;
