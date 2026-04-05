import api from '../../../lib/axios';

const categoryService = {
  // GET /api/Categories/all
  async getAll() {
    try {
      const response = await api.get('/Categories/all');
      return response.data;
    } catch (error) {
      console.warn('[categoryService] Lỗi getAll', error);
    }
  },

  // GET /api/Categories/filter
  async filter(params = {}) {
    try {
      const response = await api.get('/Categories/filter', { params });
        console.log("RAW RESPONSE:", response);
        return response.data;
    } catch (error) {
      console.error('[categoryService] Lỗi filter data từ API:', error);
      throw error;
    }
  },

  // GET /api/Categories/{id}
  async getById(id) {
    try {
      const response = await api.get(`/Categories/${id}`);
      return response.data;
    } catch (error) {
      console.warn('[categoryService] Lỗi getById, trả về null', error);
    }
  },

  // POST /api/Categories
  async create(data) {
    try {
      const response = await api.post('/Categories', data);
      return response.data;
    } catch (error) {
      console.error('[categoryService] Lỗi khi tạo danh mục:', error);
      throw error;
    }
  },

  // PUT /api/Categories/{id}
  async update(id, data) {
    try {
      const response = await api.put(`/Categories/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('[categoryService] Lỗi khi cập nhật danh mục:', error);
      throw error;
    }
  },

  // DELETE /api/Categories/{id}/soft-delete
  async softDelete(id) {
    try {
      const response = await api.delete(`/Categories/${id}/soft-delete`);
      return response.data;
    } catch (error) {
      console.error('[categoryService] Lỗi khi xóa mềm:', error);
      throw error;
    }
  },

  // DELETE /api/Categories/{id}/permanent-delete
  async permanentDelete(id) {
    try {
      const response = await api.delete(`/Categories/${id}/permanent-delete`);
      return response.data;
    } catch (error) {
      console.error('[categoryService] Lỗi khi xóa vĩnh viễn:', error);
      throw error;
    }
  },
  
  // PUT /api/Categories/{id}/restore
  async restore(id) {
    try {
      const response = await api.put(`/Categories/${id}/restore`);
      return response.data;
    } catch (error) {
      console.error('[categoryService] Lỗi restore:', error);
      throw error;
    }
  },

  // GET /api/Categories/check-name?name=...
  async checkName(name) {
    try {
      const response = await api.get('/Categories/check-name', { params: { name } });
      return response.data;
    } catch (error) {
      console.warn('[categoryService] Lỗi checkName:', error);
      return false;
    }
  },

  // GET /api/Categories/{id}/products
  async getProductsByCategory(id) {
    try {
      const response = await api.get(`/Categories/${id}/products`);
      return response.data;
    } catch (error) {
      console.warn('[categoryService] Lỗi getProductsByCategory:', error);
      return [];
    }
  }
};

export default categoryService;
