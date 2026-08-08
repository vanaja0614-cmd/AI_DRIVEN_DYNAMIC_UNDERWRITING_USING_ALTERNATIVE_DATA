const STEPS = ["Application", "Consent", "Results"];

export default function ProgressStepper({ currentStep }) {
  // currentStep is 1-indexed (1, 2, or 3)
  return (
    <div className="mb-xl">
      <div className="flex justify-between items-center mb-sm">
        <span className="font-label-md text-label-md text-on-surface-variant">
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
          {STEPS[currentStep - 1]}
        </span>
      </div>
      <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden flex gap-[2px]">
        {STEPS.map((step, i) => (
          <div
            key={step}
            className={`h-full flex-1 rounded-full transition-colors ${
              i + 1 <= currentStep
                ? "bg-primary shadow-[0_0_10px_rgba(107,216,203,0.5)]"
                : "bg-surface-container-highest"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-xs font-label-sm text-label-sm text-on-surface-variant">
        {STEPS.map((step, i) => (
          <span
            key={step}
            className={i + 1 === currentStep ? "text-on-surface" : ""}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
