/**
 * util.js — Các hàm tiện ích dùng chung
 *
 * Cung cấp các hàm format số, tiền tệ, ngày tháng theo kiểu Việt Nam
 */

/**
 * Định dạng số có dấu phân cách hàng nghìn
 * VD: 24510 → "24.510"
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('vi-VN');
}

/**
 * Định dạng tiền tệ Việt Nam
 * VD: 1250000000 → "1.250.000.000đ"
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '0đ';
  return Number(amount).toLocaleString('vi-VN') + 'đ';
}

/**
 * Rút gọn số lớn
 * VD: 1250000 → "1.25M", 1500 → "1.5K"
 */
export function formatCompact(num) {
  const n = Number(num);
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}
