export default function EmptyState({
  icon = "inbox",
  title = "Nothing here yet",
  message,
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-xl gap-sm">
      <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <h4 className="font-headline-md text-headline-md text-on-surface">
        {title}
      </h4>
      {message && (
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          {message}
        </p>
      )}
      {action && <div className="mt-sm">{action}</div>}
    </div>
  );
}
