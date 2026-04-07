import Button from '../../../components/ui/Button.jsx';
import ProductBasicInfo from './ProductBasicInfo';
import ProductPricing from './ProductPricing';
import ProductSpecs from './ProductSpecs';

/**
 * ProductForm.jsx - Main form orchestrator
 * Responsible for:
 * - Form submission
 * - Validation
 * - Rendering sub-components (BasicInfo, Pricing, Specs)
 * 
 * Sub-components handle their own state updates via setFormData
 */
export default function ProductForm({ 
  formData, 
  setFormData, 
  categories, 
  onSubmit, 
  onCancel, 
  errors = {} 
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.code?.trim() || !formData.name?.trim() || !formData.categoryId) {
      console.warn('Vui lòng điền thông tin bắt buộc');
      return;
    }
    const originalPrice = Number(formData.originalPrice ?? formData.importPrice ?? 0);
    const sellingPrice = Number(formData.price ?? formData.sellingPrice ?? 0);
    if (originalPrice <= 0 || sellingPrice <= 0) {
      console.warn('Giá nhập và giá bán phải lớn hơn 0');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Section 1: Basic Info */}
      <ProductBasicInfo 
        formData={formData} 
        setFormData={setFormData} 
        categories={categories}
        errors={errors}
      />
      
      {/* Section 2: Pricing */}
      <ProductPricing 
        formData={formData} 
        setFormData={setFormData}
        errors={errors}
      />
      
      {/* Section 3: Description & Specs */}
      <ProductSpecs 
        formData={formData} 
        setFormData={setFormData}
        errors={errors}
      />

      {/* Form Actions */}
      <div className="pt-8 border-t border-slate-100 flex items-center justify-end gap-3">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          Lưu sản phẩm
        </Button>
      </div>
    </form>
  );
}

