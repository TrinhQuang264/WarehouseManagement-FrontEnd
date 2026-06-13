import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import usePageMode from "../../../hooks/usePageMode";
import { useHeader } from "../../../contexts/HeaderContext";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../../auth/hooks/useAuth.jsx";
import TrashBinDrawer from "../../../components/ui/TrashBinDrawer";
import productService from "../api/productsService";

import "../styles/Products.css";
import ProductsTable from "../components/ProductsTable";
import ProductsPagination from "../components/ProductsPagination";
import ProductForm from "../components/ProductForm";
import ProductImageUpload from "../components/ProductImageUpload";
import ConfirmModal from "../../../components/ui/ConfirmModal.jsx";
import toast from "../../../utils/toast";
import { PRODUCT_URLS } from "../../../constants/urls";

const DEFAULT_PRODUCT_FORM = {
  code: "",
  name: "",
  description: "",
  categoryId: "",
  originalPrice: 1,
  importPrice: 1,
  price: "",
  imageUrl: "",
  specs: [],
  warehouseLocation: "",
};

const getEntityFromResponse = (response) => response?.data ?? response ?? null;

const pickProductId = (responseEntity, fallbackId = null) => {
  const value = responseEntity?.id ?? responseEntity?.productId ?? fallbackId;
  return value != null ? Number(value) : null;
};

const pickImageUrl = (image = {}) =>
  image?.imageUrl || image?.url || image?.path || image?.thumbnailUrl || "";

const sanitizeImageUrlForPayload = (imageUrl) => {
  const value = String(imageUrl || "").trim();
  if (!value) return "";
  if (value.startsWith("data:image/")) return "";
  return value;
};

export default function ProductsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";
  // Route mode + page header controls
  const mode = usePageMode("/products");
  const {
    setTitle,
    setActionButton,
    setExtraActions,
    setOnSearch,
    setSearchValue,
    resetHeader,
  } = useHeader();
  const navigate = useNavigate();

  // Products list/form/trash states and actions from hook
  const {
    filteredProducts,
    categories,
    loading,
    currentPage,
    pageSize,
    totalCount,
    setCurrentPage,
    searchProducts,

    // Form handlers - these will be managed locally now
    handleAddProduct,
    handleUpdateProduct,

    // Trash state
    isTrashOpen,
    setIsTrashOpen,
    refreshList,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedProduct,
    handleSoftDelete,
    openDeleteModal,
    isSubmitting,
  } = useProducts(8);

  // Local UI state for add/edit form
  const [formData, setFormData] = useState(DEFAULT_PRODUCT_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState("");

  useEffect(() => {
    if (mode.list) {
      setActionButton({
        label: "Thêm sản phẩm",
        icon: <Plus size={18} />,
        onClick: () => navigate(PRODUCT_URLS.new),
        className: "shadow-lg shadow-primary/20",
      });

      setExtraActions(
        isAdmin
          ? [
              {
                label: "Thùng rác",
                icon: <Trash2 size={18} />,
                onClick: () => setIsTrashOpen(true),
                variant: "danger",
              },
            ]
          : [],
      );

      setOnSearch(() => searchProducts);

      if (setSearchValue) {
        setSearchValue("");
      }
    } else if (mode.add) {
      setTitle("Thêm Sản Phẩm Mới");
      setActionButton(null);
      setExtraActions([]);
      setOnSearch(null);
    } else if (mode.edit) {
      setTitle("Cập Nhật Sản Phẩm");
      setActionButton(null);
      setExtraActions([]);
      setOnSearch(null);
    }

    return () => {
      resetHeader();
    };
  }, [
    mode.current,
    setTitle,
    setActionButton,
    setExtraActions,
    setOnSearch,
    setSearchValue,
    searchProducts,
    navigate,
    setIsTrashOpen,
    resetHeader,
  ]);

  // Handle Edit Data Initialization
  useEffect(() => {
    if (mode.add) {
      setFormData(DEFAULT_PRODUCT_FORM);
      setImagePreview(null);
      setSelectedImageFile(null);
      setSelectedImageName("");
    }
  }, [mode.add, setFormData]);

  useEffect(() => {
    if (!mode.edit || !mode.id) return;

    let isMounted = true;

    const loadProductDetail = async () => {
      try {
        const response = await productService.getById(mode.id);
        const productToEdit = response?.data ?? response;
        if (!isMounted || !productToEdit) return;

        const originalPriceVal = productToEdit.originalPrice || 1;
        const priceVal = productToEdit.sellingPrice ?? "";
        const quantityVal =
          productToEdit.quantity ?? productToEdit.initialStock ?? 0;

        setFormData({
          code: productToEdit.code ?? "",
          name: productToEdit.name ?? "",
          description: productToEdit.description ?? "",
          categoryId: productToEdit.categoryId ?? "",
          originalPrice: originalPriceVal,
          sellingPrice: priceVal,
          imageUrl: productToEdit.imageUrl ?? "",
          initialStock: quantityVal,
          quantity: quantityVal,
          warehouseLocation: productToEdit.warehouseLocation ?? "",
        });
        setImagePreview(productToEdit.imageUrl || null);
        setSelectedImageFile(null);
        setSelectedImageName("");
      } catch (error) {
        console.error("ProductsPage - loadProductDetail error:", error);
      }
    };

    loadProductDetail();

    return () => {
      isMounted = false;
    };
  }, [mode.edit, mode.id]);

  const handleEdit = (product) => {
    navigate(PRODUCT_URLS.edit(product.id));
  };

  const handleDelete = (product) => {
    openDeleteModal(product);
  };

  const onSubmit = async (data) => {
    const safeImageUrl = sanitizeImageUrlForPayload(data.imageUrl);
    const payload = {
      ...data,
      originalPrice: data.originalPrice || 1,
      imageUrl: safeImageUrl,
    };

    let submitResult = null;
    if (mode.edit) {
      submitResult = await handleUpdateProduct(mode.id, payload);
    } else {
      submitResult = await handleAddProduct(payload);
    }
    if (!submitResult) return;

    const savedProduct = getEntityFromResponse(submitResult);
    const productId = pickProductId(savedProduct, mode.edit ? mode.id : null);

    if (productId && selectedImageFile) {
      try {
        const uploadedResponse = await productService.uploadProductImage(
          productId,
          selectedImageFile,
        );
        const uploadedEntity = getEntityFromResponse(uploadedResponse);
        const uploadedImages = Array.isArray(uploadedEntity)
          ? uploadedEntity
          : Array.isArray(uploadedEntity?.images)
            ? uploadedEntity.images
            : [uploadedEntity].filter(Boolean);

        const firstImage = uploadedImages[0];
        const imageId = firstImage?.id ?? firstImage?.imageId;
        if (imageId) {
          await productService.updateThumbnail(productId, imageId);
        }

        const refreshedImagesResponse =
          await productService.getProductImages(productId);
        const refreshedImagesEntity = getEntityFromResponse(
          refreshedImagesResponse,
        );
        const refreshedImages = Array.isArray(refreshedImagesEntity)
          ? refreshedImagesEntity
          : Array.isArray(refreshedImagesEntity?.images)
            ? refreshedImagesEntity.images
            : [];
        const thumbnailImage =
          refreshedImages.find((img) => img?.isThumbnail || img?.isPrimary) ||
          refreshedImages[0];
        const serverImageUrl = pickImageUrl(thumbnailImage);
        if (serverImageUrl) {
          setFormData((prev) => ({ ...prev, imageUrl: serverImageUrl }));
        }
      } catch (error) {
        console.error("ProductsPage - limit upload error:", error);
        toast.error(
          "Sản phẩm đã được lưu nhưng không thể tải ảnh lên. Bạn có thể thử lại sau.",
        );
      }
    }

    refreshList();
    navigate(PRODUCT_URLS.list);
  };

  // Render switches based on mode
  if (mode.isModify) {
    return (
      <div className="products-page">
        <div className="page-header">
          <div>
            <nav className="flex text-sm text-slate-500 mb-2">
              <Link to="/" className="hover:text-primary transition-colors">
                Tổng quan
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <Link
                to="/products"
                className="hover:text-primary transition-colors"
              >
                Sản phẩm
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-900 font-medium">
                {mode.add ? "Thêm mới" : "Cập nhật"}
              </span>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <ProductImageUpload
              imagePreview={imagePreview}
              selectedImageName={selectedImageName}
              handleImageChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedImageFile(file);
                  setSelectedImageName(file.name || "");
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              productId={mode.edit ? mode.id : null}
              onThumbnailChange={(thumbUrl) => {
                setImagePreview(thumbUrl);
                setFormData((prev) => ({ ...prev, imageUrl: thumbUrl }));
              }}
            />
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <ProductForm
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                onSubmit={onSubmit}
                onCancel={() => navigate(PRODUCT_URLS.list)}
                productId={mode.edit ? mode.id : null}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT: LIST MODE
  return (
    <>
      <div className="products-page">
        <div className="page-header">
          <div>
            <nav className="flex text-sm text-slate-500 mb-2">
              <Link to="/" className="hover:text-primary transition-colors">
                Tổng quan
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-900 font-medium">Sản phẩm</span>
            </nav>
          </div>
        </div>
        <div className="space-y-6">
          <ProductsTable
            products={filteredProducts}
            categories={categories}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showDelete={isAdmin}
          />

          {totalCount > 0 && (
            <ProductsPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
              totalCount={totalCount}
            />
          )}
        </div>
      </div>

      <TrashBinDrawer
        isOpen={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        title="Thùng rác sản phẩm"
        service={productService}
        onDataChange={refreshList}
        columns={[
          { label: "Giá", key: "price" },
          { label: "Tồn kho", key: "quantity" },
        ]}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleSoftDelete}
        title="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn chuyển sản phẩm "${selectedProduct?.name}" vào thùng rác?`}
        confirmText="Xác nhận xóa"
        loading={isSubmitting}
        variant="danger"
      />
    </>
  );
}
