import Button from "../../../components/ui/Button.jsx";
import ProductBasicInfo from "./ProductBasicInfo";
import ProductPricing from "./ProductPricing";
import ProductSpecs from "./ProductSpecs";
import productService from "../api/productsService";

import toast from "../../../utils/toast";

export default function ProductForm({
  formData,
  setFormData,
  categories,
  onSubmit,
  onCancel,
  errors = {},
  productId = null,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const sellPriceRaw = formData.sellingPrice;
    const originPriceRaw = formData.originalPrice;
    const stockRaw = formData.quantity ?? formData.initialStock;

    if (!formData.code?.trim()) {
      toast.warning("Vui lòng nhập mã sản phẩm.");
      return;
    }

    try {
      const existingResponse = await productService.getAll();
      const existingItems = Array.isArray(existingResponse)
        ? existingResponse
        : existingResponse?.data || [];
      const productCode = formData.code.trim().toLowerCase();
      const isDuplicateCode = existingItems.some(
        (item) =>
          String(item?.code ?? "")
            .trim()
            .toLowerCase() === productCode &&
          String(item?.id) !== String(productId),
      );
      if (isDuplicateCode) {
        toast.warning("Mã sản phẩm đã tồn tại. Vui lòng nhập mã khác.");
        return;
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra mã trùng:", error);
    }

    if (!formData.name?.trim()) {
      toast.warning("Vui lòng nhập tên sản phẩm.");
      return;
    }
    if (!formData.categoryId) {
      toast.warning("Vui lòng chọn danh mục.");
      return;
    }

    if (
      sellPriceRaw === "" ||
      sellPriceRaw === null ||
      sellPriceRaw === undefined
    ) {
      toast.warning("Vui lòng nhập giá bán.");
      return;
    }
    const sellingPrice = Number(sellPriceRaw);
    if (sellingPrice < 0) {
      toast.warning("Giá bán không được là số âm.");
      return;
    }

    if (
      originPriceRaw === "" ||
      originPriceRaw === null ||
      originPriceRaw === undefined
    ) {
      toast.warning("Vui lòng nhập giá nhập.");
      return;
    }
    const originalPrice = Number(originPriceRaw);
    if (originalPrice < 0) {
      toast.warning("Giá nhập không được là số âm.");
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
        <Button type="button" onClick={onCancel} variant="secondary">
          Hủy
        </Button>
        <Button type="submit" variant="primary">
          Lưu sản phẩm
        </Button>
      </div>
    </form>
  );
}
