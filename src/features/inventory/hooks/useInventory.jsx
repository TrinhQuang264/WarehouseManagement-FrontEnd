import { useState, useEffect, useCallback } from 'react';
import productService from '../../products/api/productsService';
import categoryService from '../../categories/api/categoriesService';

export function useInventory() {
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    totalValue: 0,
    lastUpdate: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  });

  const [loading, setLoading] = useState(false);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, lowStockOnly]);

  // Fetch danh mục
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoryService.getAll();
        const items = Array.isArray(data) ? data : (data?.data || []);
        setCategories(items.filter(c => !c.isDeleted));
      } catch (error) {
        console.error('[useInventory] Lỗi tải danh mục:', error);
      }
    };
    fetchCats();
  }, []);

  // Fetch sản phẩm, tính stats, lọc, phân trang
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getAll();
      const allItems = Array.isArray(res) ? res : (res?.data || []);

      // Tính stats từ toàn bộ dữ liệu
      const totalItems = allItems.length;
      const lowStockCount = allItems.filter(p => (p.quantity ?? 0) <= 10).length;
      const totalValue = allItems.reduce((sum, p) => {
        const qty = Number(p.quantity ?? 0);
        const price = Number(p.price ?? p.sellingPrice ?? 0);
        return sum + qty * price;
      }, 0);

      setStats({
        totalItems,
        lowStock: lowStockCount,
        totalValue,
        lastUpdate: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      });

      // Lọc
      let filtered = [...allItems];

      if (debouncedSearch) {
        const kw = debouncedSearch.toLowerCase();
        filtered = filtered.filter(p =>
          p.name?.toLowerCase().includes(kw) ||
          p.code?.toLowerCase().includes(kw)
        );
      }

      if (selectedCategory) {
        filtered = filtered.filter(p =>
          String(p.categoryId) === String(selectedCategory)
        );
      }

      if (lowStockOnly) {
        filtered = filtered.filter(p => (p.quantity ?? 0) <= 10);
      }

      // Phân trang
      const total = filtered.length;
      const start = (currentPage - 1) * pageSize;
      const paged = filtered.slice(start, start + pageSize);

      setTotalCount(total);
      setPaginatedProducts(paged);
    } catch (error) {
      console.error('[useInventory] Lỗi fetch dữ liệu:', error);
      setPaginatedProducts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
      setIsFirstFetch(false);
    }
  }, [debouncedSearch, selectedCategory, lowStockOnly, currentPage, pageSize]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    products: paginatedProducts,
    categories,
    stats,
    loading,
    isFirstFetch,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    lowStockOnly,
    setLowStockOnly,
    currentPage,
    setCurrentPage,
    pageSize,
    totalCount,
    refreshList: fetchInventory,
  };
}
