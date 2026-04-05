import React, { useState, useEffect } from "react";
import { Folder, Link, FileText, Hash, Layers } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function CategoryModal({
  isOpen,
  onClose,
  onSave,
  editingCategory,
}) {
  const [formData, setFormData] = useState({
    name: "",
    seoAlias: "",
    seoDescription: "",
    sortOrder: 0,
    parentId: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name || "",
        seoAlias: editingCategory.seoAlias || "",
        seoDescription: editingCategory.seoDescription || "",
        sortOrder: editingCategory.sortOrder || 0,
        parentId: editingCategory.parentId || 0,
      });
    } else {
      setFormData({
        name: "",
        seoAlias: "",
        seoDescription: "",
        sortOrder: 0,
        parentId: 0,
      });
    }
    setErrors({});
  }, [isOpen, editingCategory]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Tên danh mục không được để trống";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(formData);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const alias = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/([^0-9a-z-\s])/g, "")
      .replace(/(\s+)/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData({ ...formData, name, seoAlias: alias });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCategory ? "Chỉnh sửa Danh mục" : "Thêm Danh mục mới"}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button onClick={handleSave}>
            {editingCategory ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Tên danh mục"
            placeholder="Ví dụ: Đồ điện tử"
            icon={<Folder size={18} />}
            value={formData.name}
            onChange={handleNameChange}
            error={errors.name}
            required
          />
          <Input
            label="SEO Alias (Đường dẫn)"
            placeholder="do-dien-tu"
            icon={<Link size={18} />}
            value={formData.seoAlias}
            onChange={(e) =>
              setFormData({ ...formData, seoAlias: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Thứ tự sắp xếp"
            type="number"
            placeholder="0"
            icon={<Hash size={18} />}
            value={formData.sortOrder}
            onChange={(e) =>
              setFormData({
                ...formData,
                sortOrder: parseInt(e.target.value) || 0,
              })
            }
          />
          <Input
            label="Danh mục cha (ID)"
            type="number"
            placeholder="0"
            icon={<Layers size={18} />}
            value={formData.parentId}
            onChange={(e) =>
              setFormData({
                ...formData,
                parentId: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <FileText size={18} /> Mô tả danh mục
          </label>
          <textarea
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-primary transition-all min-h-[100px] resize-none"
            placeholder="Nhập mô tả ngắn cho danh mục này..."
            value={formData.seoDescription}
            onChange={(e) =>
              setFormData({ ...formData, seoDescription: e.target.value })
            }
          />
        </div>
      </div>
    </Modal>
  );
}
