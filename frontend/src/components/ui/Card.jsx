export default function Card({
  children,
  className = "",
  pad = true,
  ...rest
}) {
  return (
    <div
      className={`bg-surface-container rounded-2xl border border-outline-variant/30 ${
        pad ? "p-md" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
