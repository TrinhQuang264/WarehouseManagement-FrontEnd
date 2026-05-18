import { useState, useEffect } from 'react';
import { Upload, Trash2, Image, Star, Loader2 } from 'lucide-react';
import productService from '../api/productsService';
import toast from '../../../utils/toast';
import { getProductImageUrl } from '../../../utils/util';

export default function ProductImageUpload({ 
  // Add mode props (legacy single upload)
  imagePreview, 
  handleImageChange, 
  selectedImageName,
  
  // Edit mode props
  productId,
  onThumbnailChange // Callback to notify parent (ProductsPage) about thumbnail updates
}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Fetch product images when productId changes
  useEffect(() => {
    if (!productId) return;

    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await productService.getProductImages(productId);
        const imgList = response?.data ?? response ?? [];
        setImages(Array.isArray(imgList) ? imgList : []);
      } catch (error) {
        console.error('Lỗi khi tải danh sách ảnh:', error);
        toast.error('Không thể tải danh sách ảnh của sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [productId]);

  const handleUploadAdditional = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setLoading(true);
    try {
      const response = await productService.uploadProductImage(productId, files);
      toast.success('Tải ảnh mới lên thành công!');
      
      // Refresh list
      const updatedResponse = await productService.getProductImages(productId);
      const imgList = updatedResponse?.data ?? updatedResponse ?? [];
      const updatedImages = Array.isArray(imgList) ? imgList : [];
      setImages(updatedImages);

      // If no thumbnail exists, set the first newly uploaded image as thumbnail
      const hasThumbnail = updatedImages.some(img => img.isThumbnail || img.isPrimary);
      if (!hasThumbnail && updatedImages.length > 0) {
        const firstImg = updatedImages[0];
        const firstImgId = firstImg.id ?? firstImg.imageId;
        await handleSetThumbnail(firstImgId, updatedImages);
      }
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error);
      toast.error('Không thể tải ảnh lên');
    } finally {
      setLoading(false);
    }
  };

  const handleSetThumbnail = async (imageId, currentImages = images) => {
    setActionLoadingId(imageId);
    try {
      await productService.updateThumbnail(productId, imageId);
      toast.success('Đã thay đổi ảnh đại diện!');

      // Locally update state to reflect thumbnail change immediately
      const updated = currentImages.map(img => {
        const id = img.id ?? img.imageId;
        return {
          ...img,
          isThumbnail: id === imageId,
          isPrimary: id === imageId
        };
      });
      setImages(updated);

      // Find the selected thumbnail url
      const thumb = updated.find(img => (img.id ?? img.imageId) === imageId);
      const thumbUrl = thumb?.imageUrl ?? thumb?.url ?? thumb?.path ?? '';
      if (onThumbnailChange && thumbUrl) {
        onThumbnailChange(thumbUrl);
      }
    } catch (error) {
      console.error('Lỗi khi đổi ảnh đại diện:', error);
      toast.error('Không thể thay đổi ảnh đại diện');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) return;
    setActionLoadingId(imageId);
    try {
      await productService.deleteImage(productId, imageId);
      toast.success('Xóa hình ảnh thành công!');

      // Remove from local list
      const remaining = images.filter(img => (img.id ?? img.imageId) !== imageId);
      setImages(remaining);

      // If we deleted the thumbnail, promote the next available image
      const deletedWasThumbnail = images.find(img => (img.id ?? img.imageId) === imageId)?.isThumbnail;
      if (deletedWasThumbnail && remaining.length > 0) {
        const nextImg = remaining[0];
        const nextImgId = nextImg.id ?? nextImg.imageId;
        await handleSetThumbnail(nextImgId, remaining);
      } else if (remaining.length === 0 && onThumbnailChange) {
        onThumbnailChange(''); // No thumbnail remains
      }
    } catch (error) {
      console.error('Lỗi khi xóa ảnh:', error);
      toast.error('Không thể xóa hình ảnh');
    } finally {
      setActionLoadingId(null);
    }
  };

  // --- EDIT MODE UI ---
  if (productId) {
    const thumbnailImage = images.find(img => img.isThumbnail || img.isPrimary) || images[0];
    const thumbnailUrl = thumbnailImage?.imageUrl ?? thumbnailImage?.url ?? thumbnailImage?.path ?? '';

    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Image size={16} className="text-primary" />
            Quản lý Album Ảnh
          </h3>
          <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
            {images.length} Ảnh
          </span>
        </div>

        {/* Main/Thumbnail Preview */}
        <div className="p-6 border-b border-slate-100 flex flex-col items-center bg-slate-50/30">
          <div className="w-full aspect-square rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden relative group">
            {thumbnailUrl ? (
              <img
                src={getProductImageUrl(thumbnailUrl)}
                alt="Main product"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-4">
                <Image size={48} className="stroke-[1.5] mb-2" />
                <p className="text-xs font-medium">Chưa có ảnh đại diện</p>
              </div>
            )}
            
            {thumbnailUrl && (
              <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <Star size={10} fill="currentColor" />
                Ảnh đại diện
              </div>
            )}
          </div>
        </div>

        {/* Additional Images Gallery & Upload */}
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Hình ảnh khác</p>
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {images.map((img) => {
                const imgId = img.id ?? img.imageId;
                const url = img.imageUrl ?? img.url ?? img.path;
                const isThumb = img.isThumbnail || img.isPrimary;
                const isActionLoading = actionLoadingId === imgId;

                return (
                  <div 
                    key={imgId} 
                    className={`aspect-square rounded-lg border-2 bg-slate-50 relative group overflow-hidden transition-all ${
                      isThumb ? 'border-primary shadow-sm' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={getProductImageUrl(url)} alt="Product variant" className="w-full h-full object-cover" />
                    
                    {/* Hover Overlay Controls */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {isActionLoading ? (
                        <Loader2 className="animate-spin text-white" size={16} />
                      ) : (
                        <>
                          {!isThumb && (
                            <button
                              type="button"
                              onClick={() => handleSetThumbnail(imgId)}
                              title="Đặt làm ảnh đại diện"
                              className="w-7 h-7 bg-white text-amber-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow"
                            >
                              <Star size={14} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(imgId)}
                            title="Xóa hình ảnh"
                            className="w-7 h-7 bg-white text-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>

                    {isThumb && (
                      <div className="absolute top-1 right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-sm">
                        <Star size={10} fill="currentColor" className="stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Upload New Image Box */}
              <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-primary/50 bg-slate-50/50 hover:bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-all group">
                <Upload size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-primary mt-1">Tải ảnh</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleUploadAdditional}
                  className="hidden"
                />
              </label>
            </div>
          )}

          <div className="mt-auto bg-slate-50 rounded-lg p-3 border border-slate-100">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              * Nhấp vào ngôi sao <Star size={10} className="inline text-amber-500 fill-amber-500" /> trong danh sách để chọn làm ảnh đại diện chính của sản phẩm. Bạn có thể tải lên nhiều ảnh định dạng JPG, PNG hoặc WEBP cùng một lúc.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- ADD/CREATE MODE UI (Legacy Single Image Selection) ---
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
      <div className="p-4 border-b border-slate-50 bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Upload size={16} className="text-primary" />
          Hình ảnh sản phẩm
        </h3>
      </div>
      <div className="p-6 flex flex-col items-center">
        <label className="w-full aspect-square rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-primary/50 transition-colors overflow-hidden">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                <Upload size={32} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-900">Tải ảnh lên</p>
                <p className="text-[11px] text-slate-500 mt-1 px-4">JPG, PNG hoặc WEBP. Tối đa 5MB.</p>
              </div>
            </>
          )}
        </label>

        {imagePreview && (
          <div className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {selectedImageName || 'Ảnh sản phẩm'}
              </p>
              <p className="text-[11px] text-slate-500">Bạn có thể chọn ảnh khác</p>
            </div>
            <label className="shrink-0 cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Đổi ảnh
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

