import api from '../../../lib/axios';

const normalizeProductPayload = (data = {}, isUpdate = false) => {
  const name = String(data.name ?? '').trim();
  const code = String(data.code ?? '').trim();
  const description = String(data.description ?? '').trim();
  const categoryId = Number(data.categoryId ?? 0);
  const sellingPrice = Number(data.sellingPrice ?? data.price ?? 0);
  const originalPrice = Number(data.originalPrice ?? data.importPrice ?? 1);
  // Khi update: giữ nguyên số lượng tồn kho hiện tại từ data, không gán về 0
  // Khi create: mặc định là 0
  const initialStock = isUpdate
    ? Number(data.quantity ?? data.initialStock ?? 0)
    : Number(0);
  const imageUrl = String(data.imageUrl ?? '').trim();
  const warehouseLocation = String(data.warehouseLocation ?? '').trim();
  return {
    ...data,
    // camelCase (frontend internal + backend thường chấp nhận)
    name,
    code,
    description,
    categoryId,
    originalPrice,
    importPrice: originalPrice,
    sellingPrice,
    price: sellingPrice,
    initialStock,
    quantity: initialStock,
    imageUrl,

    // PascalCase (đảm bảo tương thích backend DTO đang validate)
    Name: name,
    Code: code,
    Description: description,
    CategoryId: categoryId,
    OriginalPrice: originalPrice,
    ImportPrice: originalPrice,
    SellingPrice: sellingPrice,
    InitialStock: initialStock,
    WarehouseLocation: warehouseLocation,
    ImageUrl: imageUrl,
  };
};

const toProductFormData = (payload = {}) => {
  const formData = new FormData();
  const append = (key, value) => {
    if (value === undefined || value === null) return;
    formData.append(key, String(value));
  };

  append('Name', payload.Name);
  append('Code', payload.Code);
  append('Description', payload.Description);
  append('CategoryId', payload.CategoryId);
  append('SellingPrice', payload.SellingPrice);
  append('Price', payload.SellingPrice); // Back-compat if needed
  append('OriginalPrice', payload.OriginalPrice);
  append('ImportPrice', payload.ImportPrice);
  append('InitialStock', payload.InitialStock);
  append('ImageUrl', payload.ImageUrl || '');
  append('WarehouseLocation', payload.WarehouseLocation);

  return formData;
};

const dumpFormDataEntries = (formData) => {
  if (!formData || typeof formData.entries !== 'function') return [];
  return Array.from(formData.entries()).map(([key, value]) => ({ key, value }));
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
      const payload = normalizeProductPayload(data);
      const formData = toProductFormData(payload);
      const response = await api.post('/Products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      console.error('Create product status:', error?.response?.status);
      console.error('Create product response data:', error?.response?.data);
      console.error('Create product payload:', normalizeProductPayload(data));
      console.error('Create product full axios error:', {
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        headers: error?.response?.headers,
        requestUrl: error?.config?.url,
        requestMethod: error?.config?.method,
        requestHeaders: error?.config?.headers,
      });
      const debugFormData = toProductFormData(normalizeProductPayload(data));
      console.table(dumpFormDataEntries(debugFormData));
      throw error;
    }
  },

  // PUT /api/Products/{productId}
  async update(productId, data) {
    try {
      // isUpdate = true để giữ nguyên số lượng tồn kho, không ghi đè về 0
      const payload = normalizeProductPayload(data, true);
      const formData = toProductFormData(payload);
      const response = await api.put(`/Products/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      console.error('Update product status:', error?.response?.status);
      console.error('Update product response data:', error?.response?.data);
      console.error('Update product payload:', normalizeProductPayload(data));
      console.error('Update product full axios error:', {
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        headers: error?.response?.headers,
        requestUrl: error?.config?.url,
        requestMethod: error?.config?.method,
        requestHeaders: error?.config?.headers,
      });
      const debugFormData = toProductFormData(normalizeProductPayload(data));
      console.table(dumpFormDataEntries(debugFormData));
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

  // POST /api/Products/{id}/images
  async uploadProductImage(id, files) {
    try {
      const formData = new FormData();
      const fileList = Array.isArray(files) ? files : [files];
      fileList.filter(Boolean).forEach((file) => {
        formData.append('images', file);
      });
      const response = await api.post(`/Products/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw error;
    }
  },
};

export default productService;
