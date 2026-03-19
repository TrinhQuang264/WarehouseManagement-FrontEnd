import { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';

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
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch danh mục
  const fetchCategories = async (isInitial = false) => {
    setLoading(true);
    if (isInitial) setIsFirstFetch(true);
    
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
      }
      
      setCategories(Array.isArray(items) ? items : []);
      setTotalCount(total);
    } catch (error) {
      console.error('[useCategories] Lỗi API:', error);
    } finally {
      setLoading(false);
      setIsFirstFetch(false);
    }
  };

  useEffect(() => {
    fetchCategories(isFirstFetch);
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
