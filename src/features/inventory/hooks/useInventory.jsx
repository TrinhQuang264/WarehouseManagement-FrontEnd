import { useState, useEffect } from 'react';

const MOCK_CATEGORIES = [
  { id: 4, name: 'Màn hình' },
  { id: 5, name: 'Pin' },
  { id: 6, name: 'Camera' },
  { id: 7, name: 'Phụ kiện' }
];

const MOCK_PRODUCTS = [
  { id: '1', name: 'Màn hình iPhone 13 Pro Max', code: 'SCR-IP13PM', categoryId: 4, quantity: 42, price: 5500000 },
  { id: '2', name: 'Pin iPhone 11 Pro', code: 'BAT-IP11P', categoryId: 5, quantity: 5, price: 850000 },
  { id: '3', name: 'Camera sau iPhone 14', code: 'CAM-IP14', categoryId: 6, quantity: 8, price: 2100000 },
  { id: '4', name: 'Nắp lưng iPhone 12 Pro', code: 'BCK-IP12P', categoryId: 7, quantity: 0, price: 650000 },
  { id: '5', name: 'Màn hình Samsung S22 Ultra', code: 'SCR-S22U', categoryId: 4, quantity: 15, price: 6200000 },
  { id: '6', name: 'Pin Samsung Note 20', code: 'BAT-N20', categoryId: 5, quantity: 30, price: 750000 },
  { id: '7', name: 'Cáp sạc Type-C to Lightning', code: 'CBL-C2L', categoryId: 7, quantity: 120, price: 250000 },
  { id: '8', name: 'Củ sạc nhanh 20W', code: 'CHG-20W', categoryId: 7, quantity: 45, price: 450000 },
  { id: '9', name: 'Tai nghe AirPods Pro 2', code: 'EAR-AP2', categoryId: 7, quantity: 22, price: 5800000 },
  { id: '10', name: 'Pin iPhone 14 Pro Max', code: 'BAT-IP14PM', categoryId: 5, quantity: 9, price: 1200000 }
];

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

  // Load Categories & Statistics from Mock Data
  useEffect(() => {
    setCategories(MOCK_CATEGORIES);
    
    const lowStockCount = MOCK_PRODUCTS.filter(p => p.quantity <= 10).length;
    const totalInventoryValue = MOCK_PRODUCTS.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0);
    
    setStats({
      totalItems: MOCK_PRODUCTS.length,
      lowStock: lowStockCount,
      totalValue: totalInventoryValue,
      lastUpdate: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    });
  }, []);

  // Fetch Inventory (Mock processing)
  const fetchInventory = (isInitial = false) => {
    setLoading(true);
    if (isInitial) setIsFirstFetch(true);

    setTimeout(() => {
      let filtered = [...MOCK_PRODUCTS];

      if (debouncedSearch) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
          p.code.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      }

      if (selectedCategory) {
        filtered = filtered.filter(p => p.categoryId.toString() === selectedCategory.toString());
      }

      if (lowStockOnly) {
        filtered = filtered.filter(p => p.quantity <= 10);
      }

      const total = filtered.length;
      setTotalCount(total);

      // Pagination
      const startIndex = (currentPage - 1) * pageSize;
      const paginated = filtered.slice(startIndex, startIndex + pageSize);

      setProducts(paginated);
      setLoading(false);
      setIsFirstFetch(false);
    }, 500); // simulate network delay
  };

  useEffect(() => {
    fetchInventory(isFirstFetch);
  }, [currentPage, pageSize, debouncedSearch, selectedCategory, lowStockOnly]);

  return {
    products, categories, stats, loading, isFirstFetch,
    search, setSearch,
    selectedCategory, setSelectedCategory,
    lowStockOnly, setLowStockOnly,
    currentPage, setCurrentPage,
    pageSize, totalCount
  };
}
