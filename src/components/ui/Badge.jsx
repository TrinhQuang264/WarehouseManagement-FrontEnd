// Map variant → className (bg + text)
const variantStyles = {
  green: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
  red: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
  orange: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
  blue: 'bg-primary-light dark:bg-primary-900/30 text-primary dark:text-primary-400',
  gray: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
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
