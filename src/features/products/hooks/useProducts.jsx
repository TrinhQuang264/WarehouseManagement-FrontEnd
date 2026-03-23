import { useState, useEffect, useMemo, useCallback } from 'react';
import productService from '../api/productsService';
import categoryService from '../../categories/api/categoriesService';
import { products as mockProducts } from '../../../utils/mockData';

/**
 * useProducts - Hook quản lý danh sách sản phẩm
 * Hiện tại: dùng mockData (fallback khi API fail)
 * Khi có API: chỉ cần bỏ try-catch fallback
 */

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
  
  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    categoryId: '',
    importPrice: '',
    price: '',
    imageUrl: '',
    specs: []
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Lấy danh mục
  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.warn('[useProducts] Lỗi lấy danh mục, dùng mockData');
    }
  };

  // Fetch sản phẩm
  const fetchProducts = async () => {
    setLoading(true);
    
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
      } else {
        throw new Error('Empty response');
      }
      
      setProducts(Array.isArray(items) ? items : []);
      setTotalCount(total);
      
    } catch (error) {
      console.warn('[useProducts] Fallback to mockData:', error.message);
      
      // Fallback về mockData khi API lỗi
      let items = [...mockProducts];
      
      // Lọc theo search
      if (debouncedSearch && debouncedSearch.trim()) {
        const keyword = debouncedSearch.toLowerCase();
        items = items.filter(p =>
          p.name.toLowerCase().includes(keyword) ||
          p.code.toLowerCase().includes(keyword) ||
          p.description?.toLowerCase().includes(keyword)
        );
      }
      
      const total = items.length;
      
      // Phân trang
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      
      setProducts(items.slice(start, end));
      setTotalCount(total);
    } finally {
      setLoading(false);
      setIsFirstFetch(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Lấy danh mục & sản phẩm lúc mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Reset page khi search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Fetch lại khi pagination/search thay đổi
  useEffect(() => {
    fetchProducts();
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

  const addProduct = async (formData) => {
    try {
      // TODO: Replace with actual API call when available
      // const response = await productService.create(formData);
      
      // For now, add to mockData locally
      const newProduct = {
        id: Math.max(...mockProducts.map(p => p.id), 0) + 1,
        ...formData,
        importPrice: Number(formData.importPrice) || 0,
        price: Number(formData.price) || 0,
        categoryId: Number(formData.categoryId) || 0,
        quantity: 0,
        isActive: true
      };

      // Add to products list
      const updatedProducts = [newProduct, ...products];
      setProducts(updatedProducts);
      setTotalCount(totalCount + 1);
      
      console.log('[useProducts] Product added successfully:', newProduct);
      // toast.success('Thêm sản phẩm thành công');
    } catch (error) {
      console.error('[useProducts] Error adding product:', error);
      // toast.error('Lỗi khi thêm sản phẩm');
      throw error;
    }
  };

  // Form handlers
  const handleOpenAdd = useCallback(() => {
    setEditingProduct(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      categoryId: '',
      importPrice: '',
      price: '',
      imageUrl: '',
      specs: []
    });
    setImagePreview(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((product) => {
    setEditingProduct(product);
    setFormData({
      code: product.code || '',
      name: product.name || '',
      description: product.description || '',
      categoryId: product.categoryId || '',
      importPrice: product.importPrice || '',
      price: product.price || '',
      imageUrl: product.imageUrl || '',
      specs: product.specs || []
    });
    setImagePreview(product.imageUrl || null);
    setIsFormOpen(true);
  }, []);

  const handleSave = useCallback(async (formDataParam) => {
    if (editingProduct) {
      // Edit mode
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id ? { ...p, ...formDataParam } : p
      );
      setProducts(updatedProducts);
      console.log('[useProducts] Product updated:', formDataParam);
    } else {
      // Add mode
      await addProduct(formDataParam);
    }
    setIsFormOpen(false);
  }, [editingProduct, products]);

  // Memoized search function for stable reference (prevents infinite loop in ProductsPageNew)
  const searchProducts = useCallback((value) => {
    setSearch(value);
  }, []);

  return {
    // Data
    filteredProducts,
    categories,
    products,
    
    // State
    loading,
    isFirstFetch,
    search,
    minPrice,
    maxPrice,
    currentPage,
    pageSize,
    totalCount,
    isFormOpen,
    editingProduct,
    formData,
    imagePreview,
    
    // Setters
    setSearch,
    setMinPrice,
    setMaxPrice,
    setCurrentPage,
    setPageSize,
    setIsFormOpen,
    setFormData,
    setImagePreview,
    
    // Handlers
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    
    // Methods
    resetFilters,
    searchProducts
  };
}
