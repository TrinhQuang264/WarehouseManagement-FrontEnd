import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * useDataManagement - Base Hook cho CRUD operations
 * Reusable cho tất cả modules (products, customers, suppliers, etc.)
 * 
 * @param {Object} service - API service (getAll, create, update, delete methods)
 * @param {Array} mockData - Fallback mock data khi API fail
 * @param {Object} options - Config { pageSize, searchFields, ... }
 * 
 * @example
 * const { items, loading, create, update, delete: deleteItem } = useDataManagement(
 *   productService,
 *   mockProducts,
 *   { pageSize: 10, searchFields: ['name', 'code'] }
 * );
 */

export function useDataManagement(service, mockData = [], options = {}) {
  // ===== DEFAULTS =====
  const defaultPageSize = options.pageSize || 10;
  const searchFields = options.searchFields || ['name', 'code'];

  // ===== STATE =====
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [totalCount, setTotalCount] = useState(0);
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Form
  const [editingItem, setEditingItem] = useState(null);

  // ===== DEBOUNCE SEARCH =====
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);  // Reset to page 1 when search changes
    }, 500);
    
    return () => clearTimeout(timer);
  }, [search]);

  // ===== FETCH DATA =====
  const fetchItems = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        pageIndex: currentPage,
        pageSize: pageSize,
        search: debouncedSearch,
        ...filters
      };
      
      // Try API first
      const response = await service.filter?.(params) || await service.getAll?.(params);
      
      let recordList = [];
      let total = 0;

      if (Array.isArray(response)) {
        recordList = response;
        total = response.length;
      } else if (response?.items) {
        recordList = response.items;
        total = response.totalCount || response.items.length;
      } else if (response?.data) {
        recordList = Array.isArray(response.data) ? response.data : [response.data];
        total = response.total || recordList.length;
      } else {
        recordList = [];
      }

      setItems(recordList);
      setTotalCount(total);
      
    } catch (err) {
      console.warn('[useDataManagement] API error, using mockData:', err?.message);
      
      // Fallback: use mockData
      let filtered = [...(mockData || [])];
      
      if (debouncedSearch?.trim()) {
        const keyword = debouncedSearch.toLowerCase();
        filtered = filtered.filter(item =>
          searchFields.some(field => {
            const value = item[field];
            return value?.toString().toLowerCase().includes(keyword);
          })
        );
      }

      const total = filtered.length;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;

      setItems(filtered.slice(start, end));
      setTotalCount(total);
      setError(err?.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, searchFields, mockData, service]);

  // ===== FETCH ON MOUNT & DEPENDENCIES =====
  useEffect(() => {
    fetchItems();
  }, [currentPage, pageSize, debouncedSearch]);

  // ===== CRUD OPERATIONS =====
  
  /**
   * Create new item
   */
  const create = useCallback(async (formData) => {
    try {
      const response = await service.create?.(formData);
      const newItem = response || { id: Math.max(...items.map(i => i.id), 0) + 1, ...formData };
      
      setItems(prev => [newItem, ...prev]);
      setTotalCount(prev => prev + 1);
      
      return newItem;
    } catch (err) {
      setError(err?.message || 'Lỗi khi tạo mới');
      throw err;
    }
  }, [items, service]);

  /**
   * Update existing item
   */
  const update = useCallback(async (id, formData) => {
    try {
      const response = await service.update?.(id, formData);
      const updatedItem = response || { ...items.find(i => i.id === id), ...formData };
      
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      
      return updatedItem;
    } catch (err) {
      setError(err?.message || 'Lỗi khi cập nhật');
      throw err;
    }
  }, [items, service]);

  /**
   * Delete item
   */
  const remove = useCallback(async (id) => {
    try {
      await service.delete?.(id);
      setItems(prev => prev.filter(item => item.id !== id));
      setTotalCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (err) {
      setError(err?.message || 'Lỗi khi xóa');
      throw err;
    }
  }, [service]);

  /**
   * Bulk delete
   */
  const bulkRemove = useCallback(async (ids) => {
    try {
      await Promise.all(ids.map(id => service.delete?.(id)));
      setItems(prev => prev.filter(item => !ids.includes(item.id)));
      setTotalCount(prev => Math.max(0, prev - ids.length));
      
      return true;
    } catch (err) {
      setError(err?.message || 'Lỗi khi xóa hàng loạt');
      throw err;
    }
  }, [service]);

  // ===== UTILITIES =====
  
  const resetFilters = useCallback(() => {
    setSearch('');
    setCurrentPage(1);
  }, []);

  const openEdit = useCallback((item) => {
    setEditingItem(item);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingItem(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ===== PAGINATION INFO =====
  const totalPages = Math.ceil(totalCount / pageSize);
  const canNextPage = currentPage < totalPages;
  const canPrevPage = currentPage > 1;

  // ===== RETURN =====
  return {
    // Data
    items,
    loading,
    error,
    totalCount,
    totalPages,
    
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    canNextPage,
    canPrevPage,
    
    // Search
    search,
    setSearch,
    
    // Editing
    editingItem,
    openEdit,
    closeEdit,
    
    // Actions
    create,
    update,
    remove,
    bulkRemove,
    fetchItems,
    resetFilters,
    clearError,
  };
}
