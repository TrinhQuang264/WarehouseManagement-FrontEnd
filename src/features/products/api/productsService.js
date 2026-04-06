import api from '../../../lib/axios';

const normalizeProductPayload = (data = {}) => {
  const sellingPrice = data.sellingPrice ?? data.price ?? 0;

  return {
    ...data,
    categoryId: data.categoryId ? Number(data.categoryId) : data.categoryId,
    importPrice: Number(data.importPrice ?? 0),
    sellingPrice: Number(sellingPrice),
    price: Number(sellingPrice),
  };
};

const productService = {

  // GET /api/Products/all
  async getAll() {
    try {
      const response = await api.get('/Products/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  },

  // GET /api/Products/{id}
  async getById(id) {
    try {
      const response = await api.get(`/Products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  },

  // GET /api/Products/get-detail/{id}
  async getDetail(id) {
    try {
      const response = await api.get(`/Products/get-detail/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product detail:', error);
      throw error;
    }
  },

  // GET /api/Products/by-category/{categoryId}
  async getByCategory(categoryId) {
    try {
      const response = await api.get(`/Products/by-category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // GET /api/Products/filter
  async filter(params = {}) {
    try {
      const response = await api.get('/Products/filter', { 
        params: { 
          isDeleted: false,
          ...params 
        } 
      });
      return response.data;
    } catch (error) {
      console.error('Error filtering products:', error);
      throw error;
    }
  },

  // POST /api/Products
  async create(data) {
    try {
      const response = await api.post('/Products', normalizeProductPayload(data));
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // PUT /api/Products/{productId}
  async update(productId, data) {
    try {
      const response = await api.put(`/Products/${productId}`, normalizeProductPayload(data));
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // PUT /api/Products/variants/{id}/price
  async updatePrice(id, price) {
    try {
      const response = await api.put(`/Products/variants/${id}/price`, price);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // PUT /api/Products/variants/{id}/stock
  async updateStock(id, stock) {
    try {
      const response = await api.put(`/Products/variants/${id}/stock`, stock);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // PUT /api/Products/{id}/thumbnail/{imageId}
  async updateThumbnail(id, imageId) {
    try {
      const response = await api.put(`/Products/${id}/thumbnail/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
 
  // PUT /api/Products/{id}/restore
  async restore(id) {
    try {
      const response = await api.put(`/Products/${id}/restore`);
      return response.data;
    } catch (error) {
      console.error('Error restoring product:', error);
      throw error;
    }
  },

  // PUT /api/Products/bulk-restore
  async bulkRestore(ids) {
    try {
      const response = await api.put('/Products/bulk-restore', { ids });
      return response.data;
    } catch (error) {
      console.error('Error bulk restoring products:', error);
      throw error;
    }
  },

  // DELETE /api/Products/{id}/images/{imageId}
  async deleteImage(id, imageId) {
    try {
      const response = await api.delete(`/Products/${id}/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // DELETE /api/Products/{id}/soft-delete
  async softDelete(id) {
    try {
      const response = await api.delete(`/Products/${id}/soft-delete`);
      return response.data;
    } catch (error) {
      console.error('Error soft deleting product:', error);
      throw error;
    }
  },

  // DELETE /api/Products/bulk-soft-delete
  async bulkSoftDelete(ids) {
    try {
      // Gửi đối tượng { ids: [...] } theo định dạng backend yêu cầu
      const response = await api.delete('/Products/bulk-soft-delete', { data: { ids } });
      return response.data;
    } catch (error) {
      console.error('Error bulk soft deleting products:', error);
      throw error;
    }
  },

  // DELETE /api/Products/{id}/permanent-delete
  async permanentDelete(id) {
    try {
      const response = await api.delete(`/Products/${id}/permanent-delete`);
      return response.data;
    } catch (error) {
      console.error('Error permanently deleting product:', error);
      throw error;
    }
  },

  // DELETE /api/Products/bulk-permanent-delete
  async bulkPermanentDelete(ids) {
    try {
      // Gửi đối tượng { ids: [...] } cho DELETE
      const response = await api.delete('/Products/bulk-permanent-delete', { data: { ids } });
      return response.data;
    } catch (error) {
      console.error('Error bulk permanent deleting products:', error);
      throw error;
    }
  },

  
  // GET /api/Products/trash
  async getTrash() {
    try {
      const response = await api.get('/Products/trash');
      return response.data;
    } catch (error) {
      console.error('[productService] Lỗi khi lấy dữ liệu thùng rác:', error);
      throw error;
    }
  },

  // GET /api/Products/{id}/images
  async getProductImages(id) {
    try {
      const response = await api.get(`/Products/${id}/images`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product images:', error);
      throw error;
    }
  },
};

export default productService;
