import { Upload } from 'lucide-react';

export default function ProductImageUpload({ imagePreview, handleImageChange, selectedImageName }) {
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
