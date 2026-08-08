const VARIANTS = {
  primary:
    "bg-primary text-on-primary-container font-semibold shadow-[0_4px_14px_rgba(107,216,203,0.3)] hover:bg-primary-fixed",
  secondary:
    "bg-surface-container text-on-surface border border-outline-variant/40 hover:bg-surface-container-high",
  ghost:
    "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-transparent",
  danger:
    "bg-error/10 text-error border border-error/30 hover:bg-error/20",
};

const SIZES = {
  sm: "px-md py-sm text-label-sm gap-xs",
  md: "px-lg py-sm text-label-md gap-xs",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon = null,
  className = "",
  disabled = false,
  ...rest
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg transition-colors font-label-md ${VARIANTS[variant]} ${SIZES[size]} disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="material-symbols-outlined text-sm animate-spin">
          progress_activity
        </span>
      ) : (
        icon && <span className="material-symbols-outlined text-sm">{icon}</span>
      )}
      {children}
    </button>
  );
}
