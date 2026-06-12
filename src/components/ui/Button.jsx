import { Loader2 } from "lucide-react";

const variantStyles = {
  primary: "bg-primary  text-white shadow-sm shadow-primary/20",
  secondary: "border border-slate-200  text-slate-600  hover:bg-slate-50",
  danger: "bg-accent-red hover:bg-red-600 text-white",
  ghost: "text-slate-600   hover:bg-slate-100 ",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className = "",
  disabled,
  ...rest
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size] || sizeStyles.md}
        ${className}
      `}
      {...rest}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}
