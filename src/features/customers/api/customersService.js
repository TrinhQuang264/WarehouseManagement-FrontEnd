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
  // Alias for compatibility with hooks/pages that call `search`
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
  // Soft delete: Lấy dữ liệu và set isDeleted = true
  async delete(id) {
    try {
      const customer = await this.getById(id);
      if (!customer) throw new Error("Customer not found");
      const updatedData = { ...customer, isDeleted: true };
      const response = await api.put(`/Customers/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('[customersService] delete (soft) error:', error);
      throw error;
    }
  },
  // Khôi phục: Lấy dữ liệu và set isDeleted = false
  async restore(id) {
    try {
      const customer = await this.getById(id);
      if (!customer) throw new Error("Customer not found");
      const updatedData = { ...customer, isDeleted: false };
      const response = await api.put(`/Customers/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('[customersService] restore error:', error);
      throw error;
    }
  },
  // Lấy danh sách thùng rác: Lấy toàn bộ và lọc theo isDeleted === true
  async getTrash() {
    try {
      const response = await api.get('/Customers/all');
      const allData = response.data || [];
      return allData.filter(item => item.isDeleted === true);
    } catch (error) {
      console.error('[customersService] getTrash error:', error);
      throw error;
    }
  },
  // Xóa vĩnh viễn: Sử dụng API DELETE /api/Customers/{id}
  async permanentDelete(id) {
    try {
      const response = await api.delete(`/Customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('[customersService] permanentDelete error:', error);
      throw error;
    }
  },
};

export default customersService;
