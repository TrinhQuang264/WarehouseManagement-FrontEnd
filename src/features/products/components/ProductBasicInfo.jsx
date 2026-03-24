export default function ProductBasicInfo({ 
  formData, 
  setFormData, 
  categories = [],
  errors = {} 
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Thông Tin Cơ Bản</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SKU/Code */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Mã sản phẩm (SKU) *
          </label>
          <input
            type="text"
            name="code"
            value={formData.code || ''}
            onChange={handleChange}
            placeholder="VD: IP15-SCR-OLED"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm font-mono"
          />
          {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Danh mục *
          </label>
          <select
            name="categoryId"
            value={formData.categoryId || ''}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
          >
            <option value="">--- Chọn danh mục ---</option>
            {categories?.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
        </div>

        {/* Product Name */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Tên sản phẩm *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            placeholder="VD: Màn hình iPhone 15 Pro Max GX OLED"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>
      </div>
    </div>
  );
}
