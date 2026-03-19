/**
 * Toast notification utility
 * Dispatches custom events to be caught by ToastContainer
 */

const dispatchToast = (type, message) => {
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
