import { Plus } from 'lucide-react';
import { useEffect, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductsSearchFilter from '../components/ProductsSearchFilter.jsx';
import ProductsTable from '../components/ProductsTable.jsx';
import ProductsPagination from '../components/ProductsPagination.jsx';
import ProductForm from '../components/ProductForm.jsx';
import ProductImageUpload from '../components/ProductImageUpload.jsx';
import ProductDetailPage from './ProductDetailPage.jsx';
import ConfirmModal from '../../../components/ui/ConfirmModal.jsx';
import Loading from '../../../components/ui/Loading.jsx';
import Breadcrumbs from '../../../components/ui/Breadcrumbs.jsx';
import { useProducts } from '../hooks/useProducts.jsx';
import { useHeader } from '../../../contexts/HeaderContext.jsx';
import { toast } from '../../../utils/toast.js';
import { PRODUCT_URLS } from '../../../constants/urls.js';
import '../styles/Products.css';

export default function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, product: null });
  const [isDeleting, setIsDeleting] = useState(false);
  
  const {
    filteredProducts,
    categories,
    loading,
    isFirstFetch,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    currentPage,
    setCurrentPage,
    pageSize,
    totalCount,
    formData,
    setFormData,
    imagePreview,
    setImagePreview,
    setIsFormOpen,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    resetFilters,
    searchProducts
  } = useProducts();

  const { setActionButton, setOnSearch, setTitle, resetHeader } = useHeader();

  // Determine form state from URL
  const isAddMode = location.pathname === PRODUCT_URLS.new;
  const isEditMode = location.pathname.startsWith(PRODUCT_URLS.edit('').split('/').slice(0, -1).join('/'));
  const isDetailMode = location.pathname.startsWith(PRODUCT_URLS.list) && 
                       !isAddMode && 
                       !isEditMode && 
                       location.pathname !== PRODUCT_URLS.list;
  const isFormActive = isAddMode || isEditMode;
  const isHeaderTitleMode = isFormActive || isDetailMode;
  const pageTitle = isEditMode
    ? 'Chỉnh sửa sản phẩm'
    : isAddMode
      ? 'Thêm sản phẩm mới'
      : isDetailMode
        ? 'Chi tiết sản phẩm' 
        : '';

  // Handle image change
  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }, [setImagePreview, setFormData]);

  // Handle open add - navigate to /products/new
  const handleOpenAddForm = useCallback(() => {
    handleOpenAdd();
    navigate(PRODUCT_URLS.new);
  }, [handleOpenAdd, navigate]);

  // Handle open edit - navigate to /products/edit/:id
  const handleOpenEditForm = useCallback((product) => {
    handleOpenEdit(product);
    navigate(PRODUCT_URLS.edit(product.id));
  }, [handleOpenEdit, navigate]);

  // Handle view detail - navigate to /products/:id
  const handleViewDetail = useCallback((product) => {
    navigate(PRODUCT_URLS.detail(product.id));
  }, [navigate]);

  // Handle close form - navigate back to /products
  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    navigate(PRODUCT_URLS.list);
  }, [setIsFormOpen, navigate]);

  // Handle save form - save and navigate back to /products
  const handleSaveForm = useCallback(async (data) => {
    await handleSave(data);
    navigate(PRODUCT_URLS.list);
  }, [handleSave, navigate]);

  // Handle delete confirm modal open
  const handleDeleteClick = useCallback((product) => {
    setDeleteConfirm({ isOpen: true, product });
  }, []);

  // Handle delete confirm
  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirm.product) return;
    
    setIsDeleting(true);
    try {
      // TODO: Call API delete when available
      // await productService.delete(deleteConfirm.product.id);
      
      // For now, just show success and close modal
      console.log('[ProductsPage] Product deleted:', deleteConfirm.product.id);
      setDeleteConfirm({ isOpen: false, product: null });
      toast.success(`✅ Xóa sản phẩm "${deleteConfirm.product?.name}" thành công`);
    } catch (error) {
      console.error('[ProductsPage] Error deleting product:', error);
      toast.error('❌ Lỗi khi xóa sản phẩm');
    } finally {
      setIsDeleting(false);
    }
  }, [deleteConfirm.product]);

  // Set header configuration
  useEffect(() => {
    // Hide action button when form is open
    if (isHeaderTitleMode) {
      setActionButton(null);
      setOnSearch(null);
      setTitle(pageTitle);
    } else {
      setActionButton({
        label: 'Thêm sản phẩm',
        icon: <Plus size={18} />,
        onClick: handleOpenAddForm,
        searchPlaceholder: 'Tìm kiếm mã, tên sản phẩm...',
        className: 'shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'
      });
      setOnSearch(searchProducts);
      setTitle('');
    }

    // Cleanup on unmount
    return () => resetHeader();
  }, [isHeaderTitleMode, pageTitle, setActionButton, setOnSearch, setTitle, handleOpenAddForm, searchProducts, resetHeader]);

  if (isFirstFetch && loading) return <Loading text="Đang tải danh sách sản phẩm..." />;

  // =====================================================
  // DETAIL VIEW (When URL is /products/:id)
  // =====================================================
  if (isDetailMode) {
    return <ProductDetailPage />;
  }

  // =====================================================
  // FORM PAGE VIEW (When URL is /products/new or /products/edit)
  // =====================================================
  if (isFormActive) {
    return (
      <div className="products-page relative">
        {/* HEADER with Breadcrumb & Title */}
        <div className="">
          <Breadcrumbs 
            items={[
              { label: 'Trang chủ', path: '/' },
              { label: 'Sản phẩm', path: '/products' },
              { label: pageTitle }
            ]}
          />     
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4 space-y-6">
            <ProductImageUpload
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              handleImageChange={handleImageChange}
            />
          </div>

          {/* Right Column (8/12): Form Card */}
          <div className="col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Form Header */}
              <div className="px-8 py-6 border-b border-slate-50 bg-white flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Thông tin sản phẩm</h3>
              </div>
              
              {/* Form Body */}
              <div className="px-8 py-8">
                <ProductForm
                  formData={formData}
                  setFormData={setFormData}
                  categories={categories}
                  onSubmit={handleSaveForm}
                  onCancel={handleCloseForm}
                  errors={{}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // LIST PAGE VIEW (Default view with table & pagination)
  // =====================================================
  return (
    <div className="products-page relative">
      {/* HEADER */}
      <div className="page-header">
        <Breadcrumbs />
      </div>

      {/* CONTENT CONTAINER */}
      <div className="relative">
        {/* SEARCH & FILTER */}
        <ProductsSearchFilter
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onResetFilters={resetFilters}
        />

        {/* TABLE */}
        <ProductsTable
          products={filteredProducts}
          categories={categories}
          loading={loading}
          onEdit={handleOpenEditForm}
          onDelete={handleDeleteClick}
          onViewDetail={handleViewDetail}
        />

        {/* PAGINATION */}
        <ProductsPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          totalCount={totalCount}
        />

        {/* Delete Confirm Modal */}
        <ConfirmModal
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, product: null })}
          onConfirm={handleDeleteConfirm}
          title="Xác nhận xóa sản phẩm"
          message={`Bạn có chắc chắn muốn xóa sản phẩm "${deleteConfirm.product?.name}"? Hành động này không thể hoàn tác.`}
          confirmLabel="Xóa"
          loading={isDeleting}
          variant="danger"
        />
      </div>
    </div>
  );
}
