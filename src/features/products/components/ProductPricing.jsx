/**
 * ProductPricing.jsx - Section 2: Pricing Information
 * Fields: Import Price, Sell Price
 */

export default function ProductPricing({ 
  formData, 
  setFormData, 
  errors = {} 
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "originalPrice") {
      setFormData(prev => ({ ...prev, originalPrice: value, importPrice: value }));
      return;
    }
    if (name === "price") {
      setFormData(prev => ({ ...prev, price: value, sellingPrice: value }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sellPrice = Number(formData.price ?? formData.sellingPrice) || 0;

  return (
    <div className="space-y-4 pt-6 border-t border-slate-100">
      <h3 className="text-lg font-semibold text-slate-900">Định Giá</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Sell Price */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">      
            Giá Bán (VNĐ)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price ?? formData.sellingPrice ?? ''}
            onChange={handleChange}
            placeholder="0"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm font-semibold text-primary"
          />
          {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
        </div>
      </div>
    </div>
  );
}
