export default function ErrorBanner({ message, children, className = "" }) {
  if (!message && !children) return null;
  return (
    <div
      className={`bg-surface-container border border-error/30 rounded-2xl p-md mb-md ${className}`}
      role="alert"
    >
      {message && (
        <p className="font-body-md text-body-md text-error mb-sm">{message}</p>
      )}
      {children}
    </div>
  );
}
