/**
 * formatNumber.js — Hàm tiện ích định dạng số
 *
 * Cung cấp các hàm format số theo kiểu Việt Nam:
 * - Dùng dấu chấm (.) ngăn cách hàng nghìn
 * - Đơn vị tiền tệ: VNĐ / đ
 */

/**
 * Định dạng số có dấu phân cách hàng nghìn
 * VD: 24510 → "24.510"
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString('vi-VN');
}

/**
 * Định dạng tiền tệ Việt Nam
 * VD: 1250000000 → "1.250.000.000đ"
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '0đ';
  return amount.toLocaleString('vi-VN') + 'đ';
}

/**
 * Rút gọn số lớn
 * VD: 1250000 → "1.25M", 1500 → "1.5K"
 * @param {number} num
 * @returns {string}
 */
export function formatCompact(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return String(num);
}
