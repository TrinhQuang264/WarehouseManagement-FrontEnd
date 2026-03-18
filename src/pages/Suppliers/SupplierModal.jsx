import React, { useState, useEffect } from 'react';
import { Package, Hash, Phone, Mail, MapPin } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

/**
 * SupplierModal - Modal dùng chung cho Thêm và Sửa nhà cung cấp
 */
export default function SupplierModal({
  isOpen,
  onClose,
  onSave,
  editingSupplier,
  nextCode
}) {
  const [formData, setFormData] = useState({
    supplierName: '',
    code: '',
    phone: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  // Reset form khi mở modal hoặc thay đổi supplier đang sửa
  useEffect(() => {
    if (editingSupplier) {
      setFormData({
        supplierName: editingSupplier.supplierName,
        code: editingSupplier.code,
        phone: editingSupplier.phone,
        email: editingSupplier.email,
        address: editingSupplier.address
      });
    } else {
      setFormData({
        supplierName: '',
        code: nextCode || '',
        phone: '',
        email: '',
        address: ''
      });
    }
    setErrors({});
  }, [isOpen, editingSupplier, nextCode]);

  const validate = () => {
    const newErrors = {};
    if (!formData.supplierName.trim()) newErrors.supplierName = 'Tên nhà cung cấp không được để trống';
    if (!formData.code.trim()) newErrors.code = 'Mã NCC không được để trống';
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại không được để trống';
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={editingSupplier ? 'Chỉnh sửa Nhà cung cấp' : 'Thêm Nhà cung cấp mới'}
      size="lg"
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>Hủy bỏ</Button>
          <Button onClick={handleSave}>
            {editingSupplier ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Tên nhà cung cấp"
            placeholder="Ví dụ: Công ty TNHH ABC"
            icon={<Package size={18} />}
            value={formData.supplierName}
            onChange={e => setFormData({...formData, supplierName: e.target.value})}
            error={errors.supplierName}
            required
          />
          <Input 
            label="Mã nhà cung cấp"
            placeholder="NCC001"
            icon={<Hash size={18} />}
            value={formData.code}
            onChange={e => setFormData({...formData, code: e.target.value})}
            error={errors.code}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Số điện thoại"
            placeholder="09xx xxx xxx"
            icon={<Phone size={18} />}
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            error={errors.phone}
            required
          />
          <Input 
            label="Email"
            placeholder="contact@supplier.vn"
            icon={<Mail size={18} />}
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            error={errors.email}
            required
          />
        </div>
        <Input 
          label="Địa chỉ"
          placeholder="Số nhà, đường, phường, quận/huyện, tỉnh/thành"
          icon={<MapPin size={18} />}
          value={formData.address}
          onChange={e => setFormData({...formData, address: e.target.value})}
        />
      </div>
    </Modal>
  );
}
