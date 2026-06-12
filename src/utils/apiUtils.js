export const extractApiErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (!data) return fallback;

  const directMessage = data.message || data.error || data.title || data.detail;
  if (directMessage) return directMessage;

  const validation = data.errors;
  if (validation && typeof validation === "object") {
    const firstKey = Object.keys(validation)[0];
    const firstValue = firstKey ? validation[firstKey] : null;
    if (Array.isArray(firstValue) && firstValue.length > 0) {
      return firstValue[0];
    }
    if (typeof firstValue === "string" && firstValue.trim()) {
      return firstValue;
    }
  }

  return fallback;
};
