import { useState, useEffect, useMemo } from 'react';
import productService from '../api/productsService';
import categoryService from '../../categories/api/categoriesService';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Lấy danh mục
  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('[useProducts] Lỗi lấy danh mục:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset về trang 1 khi tìm kiếm thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Fetch sản phẩm
  const fetchProducts = async (isInitial = false) => {
    setLoading(true);
    if (isInitial) setIsFirstFetch(true);
    
    try {
      const response = await productService.filter({
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
          items = response.items || response.data || response.results || response.products || [];
          total = response.totalCount || response.totalItems || response.count || response.total || items.length;
        }
      }
      
      setProducts(Array.isArray(items) ? items : []);
      setTotalCount(total);
    } catch (error) {
      console.error('[useProducts] Lỗi API:', error);
    } finally {
      setLoading(false);
      setIsFirstFetch(false);
    }
  };

  useEffect(() => {
    fetchProducts(isFirstFetch);
  }, [currentPage, pageSize, debouncedSearch]);

  // Lọc client-side cho giá tiền
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const price = p.importPrice || p.price || 0;
      const minMatch = minPrice === '' || price >= Number(minPrice);
      const maxMatch = maxPrice === '' || price <= Number(maxPrice);
      return minMatch && maxMatch;
    });
  }, [products, minPrice, maxPrice]);

  const resetFilters = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
  };

  return {
    products: filteredProducts,
    categories,
    loading,
    isFirstFetch,
    search,
    setSearch,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalCount,
    resetFilters
  };
}
