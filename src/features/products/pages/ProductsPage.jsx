import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import usePageMode from '../../../hooks/usePageMode';
import { useHeader } from '../../../contexts/HeaderContext';
import { useProducts } from '../hooks/useProducts';

import '../styles/Products.css';

import ProductsSearchFilter from '../components/ProductsSearchFilter';
import ProductsTable from '../components/ProductsTable';
import ProductsPagination from '../components/ProductsPagination';
import ProductForm from '../components/ProductForm';
import ProductImageUpload from '../components/ProductImageUpload';
import ProductDetailPage from './ProductDetailPage';

export default function ProductsPage() {
  const mode = usePageMode('/products');
  const { setTitle, setActionButton, setOnSearch, setSearchValue } = useHeader();
  const navigate = useNavigate();
  
  const {
    filteredProducts,
    categories,
    loading,
    minPrice,
    maxPrice,
    currentPage,
    pageSize,
    totalCount,
    setMinPrice,
    setMaxPrice,
    setCurrentPage,
    setPageSize,
    resetFilters,
    searchProducts,
    
    // Form handlers
    formData,
    setFormData,
    imagePreview,
    setImagePreview,
    handleSave,
    products
  } = useProducts();

  useEffect(() => {
    if (mode.list) {
      setTitle('Quản lý sản phẩm');
      setActionButton({
        label: "Thêm sản phẩm",
        icon: <Plus size={18} />,
        onClick: () => navigate('/products/new'),
        className: "shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]",
      });
      
      setOnSearch(() => searchProducts);
      
      if (setSearchValue) {
        setSearchValue('');
      }
    } else if (mode.add) {
      setTitle('Thêm Sản Phẩm Mới');
      setActionButton(null);
      setOnSearch(null);
    } else if (mode.edit) {
      setTitle('Cập Nhật Sản Phẩm');
      setActionButton(null);
      setOnSearch(null);
    }
    
    return () => {
      setActionButton(null);
      setOnSearch(null);
    };
  }, [mode.current, setTitle, setActionButton, setOnSearch, setSearchValue, searchProducts, navigate]);

  // Handle Edit Data Initialization
  useEffect(() => {
    if (mode.edit && products.length > 0) {
      const productToEdit = products.find(p => p.id === parseInt(mode.id));
      if (productToEdit) {
        setFormData({
          code: productToEdit.code || '',
          name: productToEdit.name || '',
          description: productToEdit.description || '',
          categoryId: productToEdit.categoryId || '',
          importPrice: productToEdit.importPrice || '',
          price: productToEdit.price || '',
          imageUrl: productToEdit.imageUrl || '',
          specs: productToEdit.specs || []
        });
      }
    } else if (mode.add) {
       setFormData({
        code: '', name: '', description: '', categoryId: '', importPrice: '', price: '', imageUrl: '', specs: []
       });
    }
  }, [mode.edit, mode.add, mode.id, products, setFormData]);

  const handleEdit = (product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handleDelete = (product) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm ${product.name}?`)) {
      console.log('Delete product', product);
      // Calls actual API inside useProducts when implemented
    }
  };

  const handleViewDetail = (product) => {
    navigate(`/products/${product.id}`);
  };

  const onSubmit = async (data) => {
    await handleSave(data);
    navigate('/products');
  };

  // Render switches based on mode
  if (mode.detail) {
    return <ProductDetailPage />;
  }

  if (mode.isModify) {
    return (
      <div className="products-page">
        <div className="page-header">
          <div>
            <nav className="flex text-sm text-slate-500 mb-2">
              <Link to="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <Link to="/products" className="hover:text-primary transition-colors">
                Sản phẩm
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-900 dark:text-white font-medium">
                {mode.add ? 'Thêm mới' : 'Cập nhật'}
              </span>
            </nav>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <ProductImageUpload 
              imagePreview={imagePreview}
              handleImageChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result);
                    setFormData(prev => ({ ...prev, imageUrl: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <ProductForm 
                formData={formData} 
                setFormData={setFormData} 
                categories={categories}
                onSubmit={onSubmit}
                onCancel={() => navigate('/products')}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT: LIST MODE
  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <nav className="flex text-sm text-slate-500 mb-2">
            <Link to="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 dark:text-white font-medium">
              Sản phẩm
            </span>
          </nav>
        </div>
      </div>
      <div className="space-y-6">
        <ProductsSearchFilter 
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onResetFilters={resetFilters}
        />
        
        <ProductsTable 
          products={filteredProducts}
          categories={categories}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetail={handleViewDetail}
        />

        {totalCount > 0 && (
          <ProductsPagination 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            totalCount={totalCount}
          />
        )}
      </div>
    </div>
  );
}
