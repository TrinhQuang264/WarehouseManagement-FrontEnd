import { ArrowRight, CircleCheck, Edit, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Breadcrumbs from '../../../components/ui/Breadcrumbs.jsx';
import DataTableCard from '../../../components/ui/DataTableCard.jsx';
import { useHeader } from '../../../contexts/HeaderContext.jsx';
import { formatCurrency, getProductImageUrl } from '../../../utils/util.js';
import productService from '../api/productsService';
import categoryService from '../../categories/api/categoriesService';

function ProductImage({ imageUrl, alt, className }) {
  const fullImageUrl = getProductImageUrl(imageUrl);
  if (!fullImageUrl) {
    return (
      <div className={`flex items-center justify-center text-sm font-medium text-slate-400 ${className}`}>
        Không có ảnh
      </div>
    );
  }

  return (
    <img
      src={fullImageUrl}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setTitle } = useHeader();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history');

  // Mock inventory history data
  const inventoryHistory = [
    {
      id: 1,
      date: '2023-11-24 14:20',
      type: 'import',
      quantity: 15,
      warehouse: 'Kho Quận 1 (Chính)',
      status: 'HOÀN TẤT'
    },
    {
      id: 2,
      date: '2023-11-22 09:15',
      type: 'export',
      quantity: -2,
      warehouse: 'Kho Quận 1 (Chính)',
      status: 'HOÀN TẤT'
    },
    {
      id: 3,
      date: '2023-11-20 16:45',
      type: 'import',
      quantity: 30,
      warehouse: 'Tổng kho (Hà Nội)',
      status: 'HOÀN TẤT'
    }
  ];

  useEffect(() => {
    let isMounted = true;
    
    const fetchProductAndCategories = async () => {
      try {
        setLoading(true);
        const [productRes, categoriesRes, imagesRes] = await Promise.all([
          productService.getById(id),
          categoryService.getAll(),
          productService.getProductImages(id).catch(err => {
            console.warn('Cannot fetch product images, using fallback', err);
            return [];
          })
        ]);

        const productData = productRes?.data || productRes;
        const allCategories = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes?.data || []);
        const imgList = imagesRes?.data ?? imagesRes ?? [];

        if (isMounted && productData) {
          // Find category name
          const category = allCategories.find(c => Number(c.id) === Number(productData.categoryId));
          const categoryName = category?.name || productData.categoryName || `Danh mục ${productData.categoryId}`;

          setProduct({
            ...productData,
            warranty: productData.warranty || '06 Tháng (Lỗi 1 đổi 1)',
            brand: productData.brand || 'Chưa cập nhật',
            specs: productData.specs || [],
            categories: productData.categoryId ? [categoryName] : [],
            importPrice: productData.importPrice ?? productData.ImportPrice ?? productData.originalPrice ?? productData.OriginalPrice ?? productData.purchasePrice ?? productData.PurchasePrice ?? productData.costPrice ?? productData.CostPrice ?? 0,
            price: productData.price ?? productData.Price ?? productData.sellingPrice ?? productData.SellingPrice ?? 0,
            quantity: productData.quantity ?? productData.Quantity ?? productData.initialStock ?? productData.InitialStock ?? 0,
            imageUrl: productData.imageUrl ?? productData.ImageUrl ?? ''
          });

          const verifiedImgList = Array.isArray(imgList) ? imgList : [];
          setImages(verifiedImgList);
          
          // Set active image to thumbnail or first available image, or product.imageUrl
          const thumbnail = verifiedImgList.find(img => img.isThumbnail || img.isPrimary);
          const defaultUrl = thumbnail?.imageUrl ?? thumbnail?.url ?? thumbnail?.path ?? productData.imageUrl ?? productData.ImageUrl ?? '';
          setActiveImage(defaultUrl);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu cho trang chi tiết:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProductAndCategories();

    return () => { isMounted = false; };
  }, [id]);

  useEffect(() => {
    if (product?.name) {
      setTitle(`Chi tiết sản phẩm: ${product.name}`);
      return;
    }

    setTitle('Chi tiết sản phẩm');
  }, [product, setTitle]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="relative">
        <div className="mb-8">
          <Breadcrumbs 
            items={[
              { label: 'Trang chủ', path: '/' },
              { label: 'Sản phẩm', path: '/products' }
            ]}
          />
          <div className="mt-4 text-center py-20">
            <p className="text-slate-600">Sản phẩm không tìm thấy</p>
            <button 
              onClick={() => navigate('/products')}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profitMargin = ((product.price - product.importPrice) / product.importPrice * 100).toFixed(1);

  return (
    <div className="relative">
      {/* BREADCRUMB & HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <Breadcrumbs 
          items={[
            { label: 'Trang chủ', path: '/' },
            { label: 'Sản phẩm', path: '/products' },
            { label: 'Chi tiết sản phẩm' }
          ]}
        />
        <button
          onClick={() => navigate(`/products/edit/${product.id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-primary hover:border-primary/30 rounded-lg shadow-sm font-semibold text-xs transition-colors"
        >
          <Edit size={14} />
          Chỉnh sửa & Quản lý ảnh
        </button>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-12 gap-8 mb-8">
        {/* LEFT COLUMN: Image & Stock */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Image Gallery */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
            <div className="aspect-square bg-slate-50 flex items-center justify-center p-8 relative">
              <ProductImage
                imageUrl={activeImage || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain transition-all duration-300"
              />
            </div>
            {images.length > 0 && (
              <div className="p-4 flex gap-2 overflow-x-auto border-t border-slate-100 bg-slate-50/50">
                {images.map((img) => {
                  const url = img.imageUrl ?? img.url ?? img.path;
                  const imgId = img.id ?? img.imageId;
                  const isActive = activeImage === url;

                  return (
                    <button
                      key={imgId}
                      onClick={() => setActiveImage(url)}
                      className={`w-16 h-16 rounded-lg border-2 bg-white flex-shrink-0 p-1 transition-all ${
                        isActive ? 'border-primary shadow-sm scale-95' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <ProductImage
                        imageUrl={url}
                        alt="Product thumbnail"
                        className="w-full h-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Information Cards */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <h3 className="font-bold text-slate-900">Thông tin cơ bản</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
              <div className="col-span-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Tên sản phẩm</label>
                <p className="text-base font-bold text-slate-900">{product.name}</p>
              </div>
              <div className="md:row-span-2 bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 flex flex-col justify-center items-center text-center">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Trạng thái tồn kho</span>
                <div className="text-4xl font-black text-emerald-700">{product.quantity}</div>
                <div className="mt-2 text-xs font-medium bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">Sản phẩm có sẵn</div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Thương hiệu</label>
                <p className="text-sm font-semibold text-slate-900">{product.brand}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Mã SKU</label>
                <p className="text-sm font-mono font-bold text-primary">{product.code}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Thời gian bảo hành</label>
                <p className="text-sm font-semibold text-slate-900">{product.warranty}</p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Danh mục</label>
                <div className="flex flex-wrap gap-2">
                  {product.categories?.map((cat, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-sm">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900">Thông tin tài chính</h3>
              </div>
              <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                Cập nhật: Vừa xong
              </span>
            </div>
            <div className="p-6 grid grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 rounded-lg">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Giá nhập</label>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(product.importPrice)}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <label className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">Giá bán</label>
                <p className="text-lg font-bold text-primary">{formatCurrency(product.price)}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-2">Lợi nhuận</label>
                <p className="text-lg font-bold text-emerald-600">+{profitMargin}%</p>
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <h3 className="font-bold text-slate-900">Mô tả chi tiết & Kỹ thuật</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-700 text-sm mb-4">{product.description}</p>        
            </div>
          </div>
        </div>
      </div>

      {/* INVENTORY HISTORY TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
        <div className="border-b border-slate-200 px-6">
          <nav className="flex gap-8">
            <button 
              onClick={() => setActiveTab('history')}
              className={`py-4 relative font-bold text-sm transition-colors ${
                activeTab === 'history' 
                  ? 'text-primary' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Lịch sử nhập/xuất
              {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
            </button>
            {/* <button 
              onClick={() => setActiveTab('variants')}
              className={`py-4 relative font-bold text-sm transition-colors ${
                activeTab === 'variants' 
                  ? 'text-primary' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Biến thể (Grades/Colors)
              {activeTab === 'variants' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('suppliers')}
              className={`py-4 relative font-bold text-sm transition-colors ${
                activeTab === 'suppliers' 
                  ? 'text-primary' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Nhà cung cấp liên kết
              {activeTab === 'suppliers' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
            </button> */}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'history' && (
            <DataTableCard>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200">
                      <th className="table-th px-4">Ngày giao dịch</th>
                      <th className="table-th px-4">Loại</th>
                      <th className="table-th px-4">Số lượng</th>
                      <th className="table-th px-4">Kho bãi</th>
                      <th className="table-th px-4 text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventoryHistory.map((entry) => (
                      <tr key={entry.id} className="table-row-hover">
                        <td className="px-4 py-4 font-mono text-xs">{entry.date}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${entry.type === 'import' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {entry.type === 'import' ? 'Nhập kho' : 'Xuất kho'}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-bold text-slate-900">{entry.quantity > 0 ? '+' : ''}{entry.quantity}</td>
                        <td className="px-4 py-4 text-slate-700">{entry.warehouse}</td>
                        <td className="px-4 py-4 text-right">
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-center">
                <button className="text-primary font-bold text-xs flex items-center gap-1 hover:underline">
                  Xem toàn bộ lịch sử
                  <span className="material-symbols-outlined text-sm">
                    <ArrowRight className='w-4 h-4'/>
                  </span>
                </button>
              </div>
            </DataTableCard>
          )}

          {/* {activeTab === 'variants' && (
            <div className="text-center py-8 text-slate-500">
              <p>Chưa có dữ liệu biến thể</p>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="text-center py-8 text-slate-500">
              <p>Chưa có nhà cung cấp liên kết</p>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
