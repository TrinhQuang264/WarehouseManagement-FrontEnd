import { Upload } from 'lucide-react';

export default function ProductImageUpload({ imagePreview, handleImageChange }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
      <div className="p-4 border-b border-slate-50 bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Upload size={16} className="text-primary" />
          Hình ảnh sản phẩm
        </h3>
      </div>
      <div className="p-6 flex flex-col items-center">
        <label className="w-full aspect-square rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-primary/50 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
            <Upload size={32} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-900">Tải ảnh lên</p>
            <p className="text-[11px] text-slate-500 mt-1 px-4">JPG, PNG hoặc WEBP. Tối đa 5MB.</p>
          </div>
        </label>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-6 w-full">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
