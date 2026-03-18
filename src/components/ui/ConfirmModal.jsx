import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

/**
 * ConfirmModal - Cửa sổ xác nhận hành động (Xóa, Hủy...)
 * @param {boolean} isOpen - Trạng thái đóng/mở
 * @param {function} onClose - Hàm khi nhấn hủy hoặc đóng
 * @param {function} onConfirm - Hàm khi nhấn xác nhận
 * @param {string} title - Tiêu đề
 * @param {string} message - Nội dung câu hỏi
 * @param {string} confirmLabel - Nhãn nút xác nhận
 * @param {boolean} loading - Trạng thái đang xử lý
 * @param {string} variant - Biến thể màu sắc (danger, primary, etc.)
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận xóa',
  message = 'Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.',
  confirmLabel = 'Của người dùng',
  loading = false,
  variant = 'danger'
}) {
  const footer = (
    <>
      <Button 
        variant="secondary" 
        onClick={onClose}
        disabled={loading}
      >
        Hủy bỏ
      </Button>
      <Button 
        variant={variant === 'danger' ? 'danger' : 'primary'}
        onClick={onConfirm}
        loading={loading}
      >
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size="sm">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full shrink-0 ${variant === 'danger' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'}`}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
}
