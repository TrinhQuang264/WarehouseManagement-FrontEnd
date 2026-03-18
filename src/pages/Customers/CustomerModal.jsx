import React, { useState, useEffect } from 'react';
import { User, Hash, Phone, Mail, MapPin } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

/**
 * CustomerModal - Modal dùng chung cho Thêm và Sửa khách hàng
 */
export default function CustomerModal({
  isOpen,
  onClose,
  onSave,
  editingCustomer,
  nextCode
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    code: '',
    phoneNumber: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        fullName: editingCustomer.fullName,
        code: editingCustomer.code,
        phoneNumber: editingCustomer.phoneNumber,
        email: editingCustomer.email || '',
        address: editingCustomer.address
      });
    } else {
      setFormData({
        fullName: '',
        code: nextCode || '',
        phoneNumber: '',
        email: '',
        address: ''
      });
    }
    setErrors({});
  }, [isOpen, editingCustomer, nextCode]);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Tên khách hàng không được để trống';
    if (!formData.code.trim()) newErrors.code = 'Mã KH không được để trống';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Số điện thoại không được để trống';
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
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
      title={editingCustomer ? 'Chỉnh sửa Khách hàng' : 'Thêm Khách hàng mới'}
      size="lg"
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>Hủy bỏ</Button>
          <Button onClick={handleSave}>
            {editingCustomer ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </>
      )}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Tên khách hàng"
            placeholder="Ví dụ: Nguyễn Văn A"
            icon={<User size={18} />}
            value={formData.fullName}
            onChange={e => setFormData({...formData, fullName: e.target.value})}
            error={errors.fullName}
            required
          />
          <Input 
            label="Mã khách hàng"
            placeholder="KH001"
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
            value={formData.phoneNumber}
            onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
            error={errors.phoneNumber}
            required
          />
          <Input 
            label="Email"
            placeholder="customer@example.com"
            icon={<Mail size={18} />}
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            error={errors.email}
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
