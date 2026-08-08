import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRunAnalysis } from "../hooks/useRunAnalysis";

const MESSAGES = [
  "Analyzing digital footprint...",
  "Cross-checking fraud signals...",
  "Generating explanation...",
];

export default function Processing() {
  const navigate = useNavigate();
  const runAnalysis = useRunAnalysis();
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState(null);
  const hasStarted = useRef(false);

  // Cycle the status text every 3s purely for visual pacing.
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Kick off the real API calls once, then move to Results when done.
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    runAnalysis()
      .then(() => navigate("/results"))
      .catch((err) => {
        setError(
          err?.response?.data?.detail ||
            err.message ||
            "Something went wrong while processing your application."
        );
      });
  }, [runAnalysis, navigate]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface text-on-surface relative overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-primary-container/10 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div className="z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-lg">
        <div className="mb-12">
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
            TrustFlow AI
          </h1>
        </div>

        <div className="relative mb-8 w-32 h-32 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full text-surface-variant animate-spin"
            style={{ animationDuration: "3s" }}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" fill="none" r="48" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" />
          </svg>
          <svg className="absolute inset-0 w-full h-full text-primary -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              fill="none"
              r="42"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="3"
              strokeDasharray="264"
              strokeDashoffset={error ? 264 : 60}
              style={{ transition: "stroke-dashoffset 1.2s ease-in-out" }}
            />
          </svg>
          <div className="bg-surface-container-high rounded-full w-16 h-16 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(107,216,203,0.15)] relative z-10">
            <span className="material-symbols-outlined text-primary text-[32px] font-bold">
              memory
            </span>
          </div>
        </div>

        <div className="min-h-[64px] flex flex-col items-center justify-start">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
            {error ? "Processing Failed" : "Processing Data"}
          </h2>
          {error ? (
            <p className="font-label-md text-label-md text-error">{error}</p>
          ) : (
            <p className="font-label-md text-label-md text-primary/80 tracking-widest uppercase min-h-[20px]">
              {MESSAGES[messageIndex]}
            </p>
          )}
        </div>

        {!error && (
          <div className="w-full max-w-[240px] h-1 bg-surface-container-high rounded-full mt-8 overflow-hidden relative border border-outline-variant/30">
            <div className="absolute top-0 left-0 h-full bg-primary rounded-full w-1/3 animate-pulse" />
          </div>
        )}

        {error && (
          <button
            onClick={() => navigate("/application")}
            className="mt-8 font-label-md text-label-md bg-primary text-on-primary-container px-lg py-sm rounded-lg font-semibold hover:bg-primary-fixed transition-colors"
          >
            Start Over
          </button>
        )}
      </div>
    </main>
  );
}
