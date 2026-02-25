/**
 * Avatar.jsx — Component hiển thị ảnh đại diện hoặc chữ viết tắt
 *
 * Props:
 *  - src: string (URL ảnh, nếu có)
 *  - alt: string (alt text cho ảnh)
 *  - name: string (tên người dùng — dùng để tạo chữ viết tắt nếu không có ảnh)
 *  - size: 'sm' | 'md' | 'lg' (kích thước)
 *  - className: string (class bổ sung)
 */

// Map size → className
const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

// Danh sách màu nền cho avatar chữ viết tắt
const bgColors = [
  'bg-primary/10 text-primary',
  'bg-indigo-100 text-indigo-600',
  'bg-amber-100 text-amber-600',
  'bg-purple-100 text-purple-600',
  'bg-emerald-100 text-emerald-600',
  'bg-rose-100 text-rose-600',
];

/**
 * Lấy chữ viết tắt từ tên
 * VD: "Nguyễn Văn An" → "NA"
 */
function getInitials(name) {
  if (!name) return '?';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

/**
 * Chọn màu nền dựa trên tên (luôn cố định cho cùng 1 tên)
 */
function getColorFromName(name) {
  if (!name) return bgColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return bgColors[Math.abs(hash) % bgColors.length];
}

export default function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  className = '',
}) {
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  // Nếu có ảnh → hiển thị ảnh
  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`${sizeClass} rounded-full object-cover border-2 border-primary/20 ${className}`}
      />
    );
  }

  // Không có ảnh → hiển thị chữ viết tắt
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold ${getColorFromName(name)} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
