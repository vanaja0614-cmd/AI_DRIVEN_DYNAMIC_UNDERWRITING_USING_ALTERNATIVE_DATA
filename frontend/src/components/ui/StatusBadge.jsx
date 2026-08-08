const TONES = {
  success: "bg-[#166534]/20 border-[#4ade80]/40 text-[#4ade80]",
  warning: "bg-[#78350f]/20 border-[#fbbf24]/40 text-[#fbbf24]",
  danger: "bg-error/20 border-error/40 text-error",
  neutral:
    "bg-surface-container-highest border-outline-variant/30 text-on-surface-variant",
  info: "bg-primary/10 border-primary/40 text-primary",
};

const ICONS = {
  success: "check",
  warning: "warning",
  danger: "cancel",
  neutral: "info",
  info: "info",
};

export default function StatusBadge({
  tone = "neutral",
  icon = null,
  children,
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm border ${TONES[tone]}`}
    >
      {(icon || ICONS[tone]) && (
        <span className="material-symbols-outlined text-xs">
          {icon || ICONS[tone]}
        </span>
      )}
      {children}
    </span>
  );
}
