import { useState, useEffect } from 'react';
import categoryService from '../api/categoriesService';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch danh mục
  const fetchCategories = async () => {
    setLoading(true);
    
    try {
      const response = await categoryService.filter({
        filter: debouncedSearch,
        pageIndex: currentPage,
        pageSize: pageSize
      });
      
      let items = [];
      let total = 0;

      if (response) {
        if (Array.isArray(response)) {
          items = response;
          total = response.length;
        } else {
          items = response.items || response.data || response.results || [];
          total = response.totalCount || response.totalItems || response.count || response.total || items.length;
        }
      } else {
        throw new Error('Empty response');
      }
      
      setCategories(Array.isArray(items) ? items : []);
      setTotalCount(total);
    } catch (error) {
      console.warn('[useCategories] Fallback to mockData:', error.message);
      
      // Fallback về mockData khi API lỗi
      let items = [...mockCategories];
      
      // Lọc theo search
      if (debouncedSearch && debouncedSearch.trim()) {
        const keyword = debouncedSearch.toLowerCase();
        items = items.filter(c =>
          c.name.toLowerCase().includes(keyword) ||
          c.seoDescription?.toLowerCase().includes(keyword)
        );
      }
      
      const total = items.length;
      
      // Phân trang
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      
      setCategories(items.slice(start, end));
      setTotalCount(total);
    } finally {
      setLoading(false);
      setIsFirstFetch(false);
    }
  };

  // Fetch danh mục lúc mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Reset page khi search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Fetch lại khi pagination/search thay đổi
  useEffect(() => {
    fetchCategories();
  }, [currentPage, pageSize, debouncedSearch]);

  return {
    categories,
    loading,
    isFirstFetch,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    pageSize,
    totalCount
  };
}
