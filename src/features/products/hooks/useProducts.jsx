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
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  
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
      // Đảm bảo chỉ hiện thị danh mục chưa xóa trong dropdown/form
      const activeCategories = Array.isArray(data) 
        ? data.filter(c => c.isDeleted === false || c.isDelete === false || (!c.isDeleted && !c.isDelete))
        : [];
      setCategories(activeCategories);
    } catch (error) {
      console.warn('[useProducts] Lỗi lấy danh mục, dùng mockData');
    }
  };

  // Fetch sản phẩm
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Sử dụng getAll() để lấy toàn bộ dữ liệu, hỗ trợ lọc và phân trang client-side chính xác nhất
      const response = await productService.getAll();
      
      let allItems = Array.isArray(response) ? response : (response.data || []);

      // 1. Tìm kiếm (Client-side)
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        allItems = allItems.filter(item => 
          (item.name && item.name.toLowerCase().includes(searchLower)) || 
          (item.code && item.code.toLowerCase().includes(searchLower)) ||
          (item.description && item.description.toLowerCase().includes(searchLower))
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
      setSelectedIds([]);
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

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const softDeleteProduct = async (id) => {
    setLoading(true);
    try {
      await productService.softDelete(id);
      // toast.success('Đã chuyển sản phẩm vào thùng rác');
      fetchProducts();
    } catch (error) {
      console.error('[useProducts] Error soft deleting product:', error);
      // toast.error('Lỗi khi xóa sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSoftDelete = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      await productService.bulkSoftDelete(selectedIds);
      // toast.success(`Đã chuyển ${selectedIds.length} sản phẩm vào thùng rác`);
      setSelectedIds([]);
      fetchProducts();
    } catch (error) {
      console.error('[useProducts] Error bulk soft deleting products:', error);
      // toast.error('Lỗi khi xóa sản phẩm hàng loạt');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

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
    formData,
    imagePreview,
    isTrashOpen,
    setIsTrashOpen,
    
    // Setters
    setSearch,
    setMinPrice,
    setMaxPrice,
    setCurrentPage,
    setPageSize,
    setIsFormOpen,
    setFormData,
    setImagePreview,
    setIsTrashOpen,
    
    // Handlers
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    toggleSelect,
    toggleSelectAll,
    softDeleteProduct,
    handleBulkSoftDelete,
    openDeleteModal,
    
    // Methods
    resetFilters,
    searchProducts,
    refreshList: fetchProducts
  };
}
