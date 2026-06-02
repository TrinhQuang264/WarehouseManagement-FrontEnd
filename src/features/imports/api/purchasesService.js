import api from '../../../lib/axios';

const purchasesService = {
  // GET /api/Purchases
  async getAll() {
    try {
      const response = await api.get('/Purchases');
      return response.data;
    } catch (error) {
      console.error('Error fetching all purchases:', error);
      throw error;
    }
  },

  // POST /api/Purchases
  async create(data) {
    try {
      const response = await api.post('/Purchases', data);
      return response.data;
    } catch (error) {
      console.error('Error creating purchase:', error);
      throw error;
    }
  },

  // GET /api/Purchases/filter
  async filter(params = {}) {
    try {
      const response = await api.get('/Purchases/filter', { params });
      return response.data;
    } catch (error) {
      console.error('Error filtering purchases:', error);
      throw error;
    }
  },

  // GET /api/Purchases/{id}
  async getById(id) {
    try {
      const response = await api.get(`/Purchases/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching purchase by id:', error);
      throw error;
    }
  },

  // PUT /api/Purchases/{id}
  async update(id, data) {
    try {
      const response = await api.put(`/Purchases/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating purchase:', error);
      throw error;
    }
  },

  // GET /api/Purchases/{id}/items
  async getItems(id) {
    try {
      const response = await api.get(`/Purchases/${id}/items`);
      return response.data;
    } catch (error) {
      console.error('Error fetching purchase items:', error);
      throw error;
    }
  },

  // POST /api/Purchases/{id}/items
  async addItems(id, items) {
    try {
      const response = await api.post(`/Purchases/${id}/items`, items);
      return response.data;
    } catch (error) {
      console.error('Error adding items to purchase:', error);
      throw error;
    }
  },

  // POST /api/Purchases/{id}/approve
  async approve(id) {
    try {
      const response = await api.post(`/Purchases/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving purchase:', error);
      throw error;
    }
  },

  // POST /api/Purchases/{id}/confirm
  async confirm(id) {
    try {
      const response = await api.post(`/Purchases/${id}/confirm`);
      return response.data;
    } catch (error) {
      console.error('Error confirming purchase:', error);
      throw error;
    }
  },

  // POST /api/Purchases/{id}/cancel
  async cancel(id, reasonObj) {
    try {
      const response = await api.post(`/Purchases/${id}/cancel`, reasonObj || { noteCancel: "Hủy bỏ bởi thủ kho" });
      return response.data;
    } catch (error) {
      console.error('Error canceling purchase:', error);
      throw error;
    }
  }
};

export default purchasesService;
