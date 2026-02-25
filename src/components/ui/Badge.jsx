/**
 * Badge.jsx — Component nhãn trạng thái
 *
 * Props:
 *  - variant: 'green' | 'red' | 'orange' | 'blue' | 'gray' (màu sắc)
 *  - children: nội dung text của badge
 */

// Map variant → className (bg + text)
const variantStyles = {
  green: 'bg-emerald-100 text-emerald-700',
  red: 'bg-red-100 text-red-700',
  orange: 'bg-amber-100 text-amber-700',
  blue: 'bg-primary-light text-primary',
  gray: 'bg-slate-100 text-slate-600',
};

export default function Badge({ variant = 'gray', children, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-full
        text-[11px] font-bold leading-none
        ${variantStyles[variant] || variantStyles.gray}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
