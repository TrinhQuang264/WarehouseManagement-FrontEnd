import api from "../../../lib/axios";

const customersService = {
  // GET /api/Customers/all
  async getAll() {
    try {
      const response = await api.get('/Customers/all');
      return response.data || [];
    } catch (error) {
      console.warn('[customersService] getAll error:', error);
      return [];
    }
  },
  // GET /api/Customers/filter
  async filter(params = {}) {
    try {
      const response = await api.get('/Customers/filter', {
        params: { isDeleted: false, ...params },
      });
      return response.data;
    } catch (error) {
      console.error('[customersService] filter error:', error);
      throw error;
    }
  },
  async search(params = {}) {
    return this.filter(params);
  },
  // GET /api/Customers/{id}
  async getById(id) {
    try {
      const response = await api.get(`/Customers/${id}`);
      return response.data;
    } catch (error) {
      console.warn('[customersService] getById error, returning null:', error);
      return null;
    }
  },
  // POST /api/Customers
  async create(data) {
    try {
      const response = await api.post('/Customers', data);
      return response.data;
    } catch (error) {
      console.error('[customersService] create error:', error);
      throw error;
    }
  },
  // PUT /api/Customers/{id}
  async update(id, data) {
    try {
      const response = await api.put(`/Customers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('[customersService] update error:', error);
      throw error;
    }
  },
  // DELETE /api/Customers/{id}/soft-delete
  async softDelete(id) {
    try {
      const response = await api.delete(`/Customers/${id}/soft-delete`);
      return response.data;
    } catch (error) {
      console.error('[customersService] softDelete error:', error);
      throw error;
    }
  },
  // PUT /api/Customers/{id}/restore
  async restore(id) {
    try {
      const response = await api.put(`/Customers/${id}/restore`);
      return response.data;
    } catch (error) {
      console.error('[customersService] restore error:', error);
      throw error;
    }
  },
  // GET /api/Customers/trash
  async getTrash() {
    try {
      const response = await api.get('/Customers/trash');
      return response.data;
    } catch (error) {
      console.error('[customersService] getTrash error:', error);
      throw error;
    }
  },
  // DELETE /api/Customers/{id}/permanent-delete
  async permanentDelete(id) {
    try {
      const response = await api.delete(`/Customers/${id}/permanent-delete`);
      return response.data;
    } catch (error) {
      console.error('[customersService] permanentDelete error:', error);
      throw error;
    }
  },
};

export default customersService;
