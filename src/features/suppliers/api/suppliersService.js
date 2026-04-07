import api from "../../../lib/axios";

const suppliersService = {
    // GET /api/Suppliers/all
    async getAll() {
        try {
            const response = await api.get('/Suppliers/all');
            return response.data || [];
        } catch (error) {
            console.warn('[suppliersService] Lỗi getAll:', error);
            return [];
        }
    },
    // GET /api/Suppliers/filter
    async filter(params = {}) {
        try {
            const response = await api.get('/Suppliers/filter', { 
                params: { 
                    isDeleted: false,
                    ...params 
                } 
            });
            return response.data;
        } catch (error) {
            console.error('[suppliersService] Lỗi filter data từ API:', error);
            throw error;
        }
    },
    // GET /api/Suppliers/{id}
    async getById(id) {
        try {
            const response = await api.get(`/Suppliers/${id}`);
            return response.data;
        } catch (error) {
            console.warn('[suppliersService] Lỗi getById, trả về null', error);
        }
    },
    // POST /api/Suppliers
    async create(data) {
        try {
            const response = await api.post('/Suppliers', data);
            return response.data;
        } catch (error) {
            console.error('[suppliersService] Lỗi khi tạo nhà cung cấp:', error);
            throw error;
        }
    },
    // PUT /api/Suppliers/{id}
    async update(id, data) {
        try {
            const response = await api.put(`/Suppliers/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('[suppliersService] Lỗi khi cập nhật nhà cung cấp:', error);
            throw error;
        }
    },
    // PUT /api/Suppliers/{id}/soft-delete
    async softDelete(id) {
        try {
            const response = await api.delete(`/Suppliers/${id}/soft-delete`);
            return response.data;
        } catch (error) {
            console.error('[suppliersService] Lỗi khi xóa mềm:', error);
            throw error;
        }
    },
    // DELETE /api/Suppliers/{id}/permanent-delete
    async permanentDelete(id) {
        try {
            const response = await api.delete(`/Suppliers/${id}/permanent-delete`);
            return response.data;
        } catch (error) {
            console.error('[suppliersService] Lỗi khi xóa vĩnh viễn:', error);
            throw error;
        }
    },
    // PUT /api/Suppliers/{id}/restore
    async restore(id) {
        try {
            const response = await api.put(`/Suppliers/${id}/restore`);
            return response.data;
        } catch (error) {
            console.error('[suppliersService] Lỗi restore:', error);
            throw error;
        }
    },
    // GET /api/Suppliers/trash
    async getTrash() {
        try {
            const response = await api.get('/Suppliers/trash');
            return response.data;
        } catch (error) {
            console.error('[suppliersService] Lỗi khi lấy dữ liệu thùng rác:', error);
            throw error;
        }
    }
};

export default suppliersService;