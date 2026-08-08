export default function Toggle({ checked, onChange, disabled = false }) {
  return (
    <label
      className={`relative inline-flex items-center mt-1 flex-shrink-0 ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <input
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only peer"
        type="checkbox"
      />
      <div
        className={`w-11 h-6 rounded-full peer transition-colors
          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
          after:bg-white after:border after:border-gray-300 after:rounded-full
          after:h-5 after:w-5 after:transition-all
          peer-checked:after:translate-x-full peer-checked:after:border-white
          ${
            disabled
              ? "bg-primary/50 peer-checked:bg-primary/50 after:bg-white/50 after:border-none"
              : "bg-surface-variant peer-checked:bg-primary"
          }`}
      ></div>
    </label>
  );
}
