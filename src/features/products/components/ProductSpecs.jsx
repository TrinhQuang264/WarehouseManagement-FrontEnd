/**
 * ProductSpecs.jsx - Section 3: Technical Specifications
 * Fields: Description, Dynamic Specs Grid
 */

import { Plus, Trash2 } from 'lucide-react';

export default function ProductSpecs({ 
  formData, 
  setFormData, 
  errors = {} 
}) {
  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, description: value }));
  };

  // Handle specs changes
  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...(formData.specs || [])];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData(prev => ({ ...prev, specs: newSpecs }));
  };

  const addSpecRow = () => {
    const newSpecs = [...(formData.specs || [])];
    newSpecs.push({ key: '', value: '' });
    setFormData(prev => ({ ...prev, specs: newSpecs }));
  };

  const removeSpecRow = (index) => {
    const newSpecs = (formData.specs || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, specs: newSpecs }));
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

      {/* Technical Specs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Thông số kỹ thuật
          </label>
          <button
            type="button"
            onClick={addSpecRow}
            className="px-3 py-1 text-xs font-semibold text-primary border border-primary rounded-lg hover:bg-primary/5 transition-all flex items-center gap-1"
          >
            <Plus size={14} /> Thêm
          </button>
        </div>

        {/* Specs Grid */}
        <div className="space-y-2">
          {(formData.specs || []).length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg">
              Chưa có thông số nào. Nhấn "Thêm" để bắt đầu.
            </div>
          ) : (
            (formData.specs || []).map((spec, index) => (
              <div key={index} className="flex gap-2 items-start">
                {/* Key Input */}
                <input
                  type="text"
                  placeholder="Ví dụ: Resolution"
                  value={spec.key || ''}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                />

                {/* Separator */}
                <span className="py-2 text-slate-400">:</span>

                {/* Value Input */}
                <input
                  type="text"
                  placeholder="Ví dụ: 1920 x 1080 px"
                  value={spec.value || ''}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                />

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => removeSpecRow(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Xóa thông số này"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Helper Text */}
        <p className="text-xs text-slate-500 mt-3">
          💡 Thêm các thông số kỹ thuật quan trọng: Độ phân giải, Kích thước màn hình, Công suất, v.v...
        </p>

        {errors.specs && <p className="text-xs text-red-500">{errors.specs}</p>}
      </div>
    </div>
  );
}
