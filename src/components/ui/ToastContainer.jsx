import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const TOAST_DURATION = 2000;

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const handleToast = (event) => {
      const { type, message, id } = event.detail;
      const newToast = { type, message, id };
      
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, TOAST_DURATION);
    };

    window.addEventListener('app-toast', handleToast);
    return () => window.removeEventListener('app-toast', handleToast);
  }, [removeToast]);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const configs = {
    success: {
      icon: <CheckCircle className="text-emerald-500" size={20} />,
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-800 dark:text-emerald-200'
    },
    error: {
      icon: <XCircle className="text-rose-500" size={20} />,
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      border: 'border-rose-200 dark:border-rose-800',
      text: 'text-rose-800 dark:text-rose-200'
    },
    warning: {
      icon: <AlertCircle className="text-amber-500" size={20} />,
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-800 dark:text-amber-200'
    },
    info: {
      icon: <Info className="text-blue-500" size={20} />,
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200'
    }
  };

  const config = configs[toast.type] || configs.info;

  return (
    <div className={`
      ${config.bg} ${config.border} ${config.text}
      flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg
      animate-in slide-in-from-right duration-300 pointer-events-auto
      min-w-[280px] max-w-md
    `}>
      <div className="shrink-0">{config.icon}</div>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button 
        onClick={onClose}
        className="shrink-0 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
