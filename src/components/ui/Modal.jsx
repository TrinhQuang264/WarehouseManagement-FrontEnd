import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Modal - Thành phần cửa sổ bật lên dùng chung
export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  size = 'md' 
}) {
  // Đóng modal khi nhấn phím Esc
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Ngăn cuộn trang khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    fullscreen: 'w-full h-full'
  };

  const isFullscreen = size === 'fullscreen';

  const modalContent = (
    <div className={`fixed inset-0 z-[999] flex items-center justify-center ${isFullscreen ? '' : 'p-4 sm:p-6'} overflow-y-auto`}>
      {/* Backdrop */}
      {!isFullscreen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity animate-fadeIn"
          onClick={onClose}
        />
      )}
      
      {/* Modal Content */}
      <div 
        className={`relative ${sizeClasses[size]} bg-white dark:bg-slate-900 ${isFullscreen ? 'rounded-none' : 'rounded-3xl'} ${isFullscreen ? 'shadow-none' : 'shadow-[0_20px_50px_rgba(0,0,0,0.15)]'} border ${isFullscreen ? 'border-0' : 'border-slate-100 dark:border-slate-800'} flex flex-col ${isFullscreen ? 'h-screen' : 'max-h-[90vh]'} overflow-hidden animate-zoomIn`}
      >
        {/* Header */}
        <div className={`${isFullscreen ? 'px-6 sm:px-8 py-4' : 'px-8 py-6'} border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0`}>
          <h3 className={`${isFullscreen ? 'text-2xl' : 'text-xl'} font-bold text-slate-900 dark:text-white leading-none`}>
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className={`${isFullscreen ? 'px-6 sm:px-8 py-6' : 'px-8 py-8'} overflow-y-auto custom-scrollbar flex-1`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`${isFullscreen ? 'px-6 sm:px-8 py-4' : 'px-8 py-5'} border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0 bg-slate-50/50 dark:bg-slate-800/20`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
