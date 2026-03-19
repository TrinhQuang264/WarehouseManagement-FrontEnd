import { useState, useEffect } from 'react';
import productService from '../../products/api/productsService';
import categoryService from '../../categories/api/categoriesService';
import dashboardService from '../../dashboard/api/dashboardService';

export function useInventory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    totalValue: 0,
    lastUpdate: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  });
  
  const [loading, setLoading] = useState(false);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  
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

  // Lấy dữ liệu thống kê và danh mục
  useEffect(() => {
    const initPage = async () => {
      try {
        const [catData, statsData] = await Promise.all([
          categoryService.getAll(),
          dashboardService.getStats()
        ]);
        setCategories(catData || []);
        if (statsData) {
          setStats({
            totalItems: statsData.totalProducts || 0,
            lowStock: statsData.lowStockCount || 0,
            totalValue: statsData.totalInventoryValue || 0,
            lastUpdate: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          });
        }
      } catch (error) {
        console.error('[useInventory] Lỗi khởi tạo:', error);
      }
    };
    initPage();
  }, []);

  // Fetch sản phẩm
  const fetchInventory = async (isInitial = false) => {
    setLoading(true);
    if (isInitial) setIsFirstFetch(true);

    try {
      const response = await productService.filter({
        filter: debouncedSearch,
        pageIndex: currentPage,
        pageSize: pageSize,
        categoryId: selectedCategory || undefined
      });

      const items = response.items || response.data || [];
      const total = response.totalCount || items.length;

      let finalItems = items;
      if (lowStockOnly) {
        finalItems = items.filter(p => p.quantity <= 10);
      }

      setProducts(finalItems);
      setTotalCount(total);
    } catch (error) {
      console.error('[useInventory] Lỗi fetch dữ liệu:', error);
    } finally {
      setLoading(false);
      setIsFirstFetch(false);
    }
  };

  useEffect(() => {
    fetchInventory(isFirstFetch);
  }, [currentPage, pageSize, debouncedSearch, selectedCategory, lowStockOnly]);

  return {
    products,
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
    totalCount
  };
}
