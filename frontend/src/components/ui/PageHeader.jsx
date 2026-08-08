export default function PageHeader({
  kicker,
  title,
  subtitle,
  actions = null,
  sticky = true,
}) {
  return (
    <div
      className={`px-margin-desktop py-lg flex flex-wrap items-end justify-between gap-md border-b border-surface-container-high bg-surface ${
        sticky ? "sticky top-0 z-10" : ""
      }`}
    >
      <div>
        {kicker && (
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">
              {kicker}
            </span>
          </div>
        )}
        <h2 className="font-display-lg text-display-lg text-on-surface">
          {title}
        </h2>
        {subtitle && (
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-sm">{actions}</div>}
    </div>
  );
}
