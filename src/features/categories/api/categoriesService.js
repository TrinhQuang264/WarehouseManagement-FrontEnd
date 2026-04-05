import api from '../../../lib/axios';

const categoryService = {
  // GET /api/Categories/all
  async getAll() {
    try {
      const response = await api.get('/Categories/all');
      return response.data || [];
    } catch (error) {
      console.warn('[categoryService] Lỗi getAll:', error);
      return [];
    }
  },

  // GET /api/Categories/filter
  async filter(params = {}) {
    try {
      // Mặc định lọc isDeleted=false nếu không truyền gì vào params
      const response = await api.get('/Categories/filter', { 
        params: { 
          isDeleted: false,
          ...params 
        } 
      });
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

  // PUT /api/Categories/{id}/soft-delete
  async softDelete(id) {
    try {
      const response = await api.delete(`/Categories/${id}/soft-delete`);
      return response.data;
    } catch (error) {
      console.error('[categoryService] Lỗi khi xóa mềm:', error);
      throw error;
    }
  },

  // PUT /api/Categories/bulk-soft-delete
  async bulkSoftDelete(ids) {
    try {
      const response = await api.delete('/Categories/bulk-soft-delete', { data: { ids } });
      return response.data;
    } catch (error) {
      console.error('[categoryService] Lỗi xóa mềm hàng loạt:', error);
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

  // DELETE /api/Categories/bulk-permanent-delete 
  async bulkPermanentDelete(ids) {
    try {
      const response = await api.delete('/Categories/bulk-permanent-delete', { data: { ids } });
      return response.data;
    } catch (error) {
      console.error('[categoryService] Lỗi xóa vĩnh viễn hàng loạt:', error);
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
  },

  // GET /api/Categories/trash
  async getTrash() {
    try {
      const response = await api.get('/Categories/trash');
      return response.data;
    } catch (error) {
      console.error('[categoryService] Lỗi khi lấy dữ liệu thùng rác:', error);
      throw error;
    }
  }
};

export default categoryService;
