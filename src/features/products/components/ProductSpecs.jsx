export default function ProductSpecs({ 
  formData, 
  setFormData, 
  errors = {} 
}) {
  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, description: value }));
  };

  return (
    <div className="space-y-6 pt-6 border-t border-slate-100">
      <h3 className="text-lg font-semibold text-slate-900">Mô Tả & Thông Số Kỹ Thuật</h3>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Mô tả chi tiết
        </label>
        <textarea
          value={formData.description || ''}
          onChange={handleDescriptionChange}
          placeholder="Nhập thông tin chung về sản phẩm, tình trạng hàng, hoặc thông tin bảo hành..."
          rows="4"
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm resize-none"
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>
    </div>
  );
}
