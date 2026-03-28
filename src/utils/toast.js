/**
 * Toast notification utility
 * Dispatches custom events to be caught by ToastContainer
 */

const dispatchToast = (type, message) => {
  // Console log for debugging
  const colors = {
    success: 'color: #10b981; font-weight: bold;',
    error: 'color: #ef4444; font-weight: bold;',
    info: 'color: #3b82f6; font-weight: bold;',
    warning: 'color: #f59e0b; font-weight: bold;'
  };
  console.log(`%c[Toast ${type.toUpperCase()}]`, colors[type] || '', message);

  const event = new CustomEvent('app-toast', {
    detail: { type, message, id: Date.now() }
  });
  window.dispatchEvent(event);
};

export const toast = {
  success: (message) => dispatchToast('success', message),
  error: (message) => dispatchToast('error', message),
  info: (message) => dispatchToast('info', message),
  warning: (message) => dispatchToast('warning', message),
};

export default toast;
