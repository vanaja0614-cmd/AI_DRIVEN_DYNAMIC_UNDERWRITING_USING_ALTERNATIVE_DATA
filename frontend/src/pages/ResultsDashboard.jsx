import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SideNav from "../components/layout/SideNav";
import { useApplication } from "../context/ApplicationContext";
import { useRunAnalysis } from "../hooks/useRunAnalysis";
import { syncAnalysis } from "../api/firebase";

const CIRCUMFERENCE = 2 * Math.PI * 40; // r=40 in the gauge SVG

const TABS = [
  { key: "underwriting", label: "Underwriting", icon: "workspace_premium" },
  { key: "risk", label: "Risk Monitor", icon: "monitoring" },
  { key: "sources", label: "Data Source", icon: "database" },
];

const DATA_SOURCES = [
  {
    key: "bureau",
    icon: "account_balance",
    title: "Traditional Bureau baseline",
    desc: "Credit bureau score and standard application details",
    required: true,
    enabled: true,
  },
  {
    key: "employmentSignals",
    icon: "school",
    title: "Employment & Education signals",
    desc: "Employer, tenure, and education verification data",
    enabled: true,
  },
  {
    key: "professionalPresence",
    icon: "badge",
    title: "Professional Presence",
    desc: "LinkedIn, professional network, and career history signals",
    enabled: true,
  },
  {
    key: "digitalSignals",
    icon: "devices",
    title: "Digital Engagement",
    desc: "App usage, login frequency, and online activity behavior",
    enabled: true,
  },
  {
    key: "publicData",
    icon: "public",
    title: "Publicly Available Information",
    desc: "Public records and other publicly accessible data sources",
    enabled: true,
  },
];

function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ScoreGauge({ scorePct }) {
  const dashOffset = CIRCUMFERENCE - (CIRCUMFERENCE * scorePct) / 100;
  return (
    <div className="relative w-56 h-56 flex-shrink-0">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" fill="none" r="40" stroke="#1E293B" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          fill="none"
          r="40"
          stroke="#0D9488"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center -mt-2">
        <span className="font-display-lg text-display-lg text-on-surface leading-none">
          {Math.round(scorePct)}
        </span>
        <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">
          Risk Score
        </span>
      </div>
    </div>
  );
}

function RiskBands({ scorePct }) {
  const bands = [
    { label: "LOW", from: 75, color: "bg-[#4ade80]", text: "text-[#4ade80]" },
    { label: "MEDIUM", from: 50, color: "bg-[#fbbf24]", text: "text-[#fbbf24]" },
    { label: "HIGH", from: 0, color: "bg-[#ff8a80]", text: "text-[#ff8a80]" },
  ];
  return (
    <div className="flex items-center gap-xs">
      {bands.map((band) => {
        const active = scorePct >= band.from;
        return (
          <div
            key={band.label}
            className={`flex-1 rounded-lg px-sm py-1 text-center font-label-sm text-label-sm border transition-colors ${
              active
                ? `${band.color} text-on-primary-container border-transparent font-bold`
                : "bg-surface-container-highest text-on-surface-variant border-outline-variant/20"
            }`}
          >
            {band.label}
          </div>
        );
      })}
    </div>
  );
}

const DECISION_STYLES = {
  APPROVE: {
    badge: "bg-[#166534]/20 border-[#4ade80]/40 text-[#4ade80]",
    icon: "check_circle",
    label: "Approved",
  },
  REVIEW: {
    badge: "bg-[#78350f]/20 border-[#fbbf24]/40 text-[#fbbf24]",
    icon: "hourglass_top",
    label: "Under Review",
  },
  REJECT: {
    badge: "bg-error/20 border-error/40 text-error",
    icon: "cancel",
    label: "Declined",
  },
};

function StatusChip({ enabled, required }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm border ${
        enabled
          ? "bg-[#166534]/20 border-[#4ade80]/40 text-[#4ade80]"
          : "bg-surface-container-highest border-outline-variant/30 text-on-surface-variant"
      }`}
    >
      <span className="material-symbols-outlined text-xs">
        {enabled ? "check" : "block"}
      </span>
      {enabled ? "Consented" : "Declined"}
      {required && <span className="opacity-70">· Required</span>}
    </span>
  );
}

export default function ResultsDashboard() {
  const {
    applicationId,
    consent,
    income,
    jobTitle,
    yearsEmployed,
    education,
    bureauScore,
    riskResult,
    fraudResult,
    explanationResult,
    refreshSignal,
    analysisCount,
    lastAnalysisAt,
    setState,
  } = useApplication();
  const runAnalysis = useRunAnalysis();

  const [tab, setTab] = useState("underwriting");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncedAt, setSyncedAt] = useState(null);
  const initialRunDone = useRef(false);

  const handleRefresh = async () => {
    if (!applicationId) {
      setError(
        "No application found yet. Please complete the application and consent steps first."
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { risk, fraud } = await runAnalysis();
      try {
        await syncAnalysis({
          application_id: applicationId,
          risk_score: risk?.risk_score,
          decision: risk?.decision,
          fraud_probability: fraud?.fraud_probability,
          timestamp: new Date().toISOString(),
        });
        setSyncedAt(new Date());
      } catch {
        // Sync failure shouldn't block the dashboard.
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Couldn't run a new analysis. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!applicationId) {
      setError(
        "No application found yet. Please complete the application and consent steps first."
      );
      return;
    }
    const haveResults = Boolean(
      riskResult && fraudResult && explanationResult
    );
    if (haveResults && refreshSignal === 0 && !initialRunDone.current) {
      initialRunDone.current = true;
      return;
    }
    initialRunDone.current = true;
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId, refreshSignal]);

  const scorePct = (riskResult?.risk_score ?? 0) * 100;
  const decision = riskResult?.decision?.toUpperCase();
  const decisionStyle = DECISION_STYLES[decision] || DECISION_STYLES.REVIEW;
  const fraudPct = (fraudResult?.fraud_probability ?? 0) * 100;
  const sources = DATA_SOURCES.map((s) => ({
    ...s,
    enabled: s.required ? true : Boolean(consent[s.key]),
  }));

  const inputCards = [
    { label: "Annual Income", value: `$${Number(income || 0).toLocaleString()}` },
    { label: "Bureau Score", value: bureauScore || "—" },
    { label: "Loan Amount", value: `$${Number(income || 0).toLocaleString()}` },
    { label: "Loan Term", value: "12 months" },
    { label: "Employment", value: `${yearsEmployed || 0} yrs` },
    { label: "Education", value: education || "—" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-on-surface">
      <SideNav />

      <main className="flex-1 flex flex-col md:ml-64 relative">
        <div className="px-margin-desktop py-lg flex flex-wrap items-end justify-between gap-md border-b border-surface-container-high bg-surface sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">
                Step 3 of 3: Complete
              </span>
            </div>
            <h2 className="font-display-lg text-display-lg text-on-surface">
              Analysis Overview
            </h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
              Run #{analysisCount || 1} · last updated {formatTime(lastAnalysisAt)}
            </p>
            {syncedAt && (
              <p className="font-label-sm text-label-sm text-primary mt-1 flex items-center gap-xs">
                <span className="material-symbols-outlined text-sm">cloud_done</span>
                Synced to Firebase at {formatTime(syncedAt)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-sm">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="font-label-md text-label-md bg-primary text-on-primary-container px-lg py-sm rounded-lg font-semibold hover:bg-primary-fixed transition-colors flex items-center gap-xs shadow-[0_4px_14px_rgba(107,216,203,0.3)] disabled:opacity-60"
            >
              <span
                className={`material-symbols-outlined text-sm ${
                  loading ? "animate-spin" : ""
                }`}
                style={loading ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {loading ? "progress_activity" : "refresh"}
              </span>
              {loading ? "Analyzing..." : "New Analysis"}
            </button>
            <button className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface px-md py-sm rounded-lg flex items-center gap-xs border border-outline-variant/30 hover:border-outline-variant transition-colors">
              <span className="material-symbols-outlined text-sm">download</span>
              Download Report
            </button>
          </div>
        </div>

        <div className="px-margin-desktop py-md pb-xl">
          {loading && (
            <p className="font-body-md text-body-md text-on-surface-variant mb-md">
              Running risk, fraud, and explainability checks...
            </p>
          )}

          {error && !loading && (
            <div className="bg-surface-container border border-error/30 rounded-2xl p-md mb-md">
              <p className="font-body-md text-body-md text-error mb-sm">{error}</p>
              <Link
                to="/application"
                className="text-primary hover:underline font-label-md text-label-md"
              >
                Start a new application
              </Link>
            </div>
          )}

          {!loading && !error && riskResult && (
            <>
              <div className="flex gap-sm overflow-x-auto mb-md">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex items-center gap-xs px-md py-sm rounded-xl font-label-md text-label-md transition-all border ${
                      tab === t.key
                        ? "bg-primary-container/20 border-primary/40 text-primary"
                        : "bg-surface-container border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {t.icon}
                    </span>
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === "underwriting" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                  <div className="lg:col-span-8 bg-surface-container rounded-2xl p-lg border border-outline-variant/30 flex flex-col md:flex-row items-center justify-center gap-xl relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                    <ScoreGauge scorePct={scorePct} />
                    <div className="flex-1 text-center md:text-left z-10">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-sm mb-md">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm border ${decisionStyle.badge}`}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {decisionStyle.icon}
                          </span>
                          {decisionStyle.label}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant">
                          Risk level: {riskResult.risk_level}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                        Underwriting Recommendation
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant border-l-2 border-primary pl-4">
                        Decision generated from your bureau baseline combined
                        with the alternative data signals you consented to.
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-surface-container rounded-2xl p-md border border-outline-variant/30 flex flex-col justify-center">
                    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm flex items-center gap-xs">
                      <span className="material-symbols-outlined text-primary-fixed text-sm">
                        badge
                      </span>
                      Applicant Snapshot
                    </h4>
                    <div className="space-y-2">
                      {inputCards.map((c) => (
                        <div
                          key={c.label}
                          className="flex justify-between items-baseline gap-sm"
                        >
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            {c.label}
                          </span>
                          <span className="font-label-md text-label-md text-on-surface font-semibold">
                            {c.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-12 bg-surface-container rounded-2xl p-md border border-outline-variant/30">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary-fixed">
                        psychology
                      </span>
                      Why this score?
                    </h3>
                    <div className="space-y-4">
                      {(explanationResult?.explanation ?? []).map((item) => {
                        const isNegative =
                          item.direction === "negative" || item.impact < 0;
                        const width = Math.min(Math.abs(item.impact) * 100, 100);
                        return (
                          <div key={item.feature}>
                            <div className="flex justify-between font-label-md text-label-md mb-1">
                              <span className="text-on-surface">
                                {item.feature}
                              </span>
                              <span
                                className={
                                  isNegative ? "text-error" : "text-primary-fixed"
                                }
                              >
                                {item.impact > 0 ? "+" : ""}
                                {item.impact}
                              </span>
                            </div>
                            <div
                              className={`w-full bg-surface-container-highest rounded-full h-2 flex ${
                                isNegative ? "justify-end" : ""
                              }`}
                            >
                              <div
                                className={`h-2 rounded-full ${
                                  isNegative ? "bg-error" : "bg-primary"
                                }`}
                                style={{ width: `${width}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      {(!explanationResult?.explanation ||
                        explanationResult.explanation.length === 0) && (
                        <p className="font-label-md text-label-md text-on-surface-variant">
                          No explanation factors returned.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {tab === "risk" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                  <div className="md:col-span-7 bg-surface-container rounded-2xl p-lg border border-outline-variant/30 flex flex-col items-center justify-center gap-lg relative overflow-hidden">
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                    <ScoreGauge scorePct={scorePct} />
                    <div className="w-full max-w-xs">
                      <RiskBands scorePct={scorePct} />
                    </div>
                  </div>

                  <div className="md:col-span-5 flex flex-col gap-gutter">
                    <div className="bg-surface-container rounded-2xl p-md border border-outline-variant/30 flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                          Fraud Probability
                        </h4>
                        <span className="material-symbols-outlined text-primary-fixed">
                          security
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="font-display-lg text-display-lg text-on-surface">
                          {Math.round(fraudPct)}%
                        </span>
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm border ${
                            fraudResult?.risk_level === "HIGH"
                              ? "bg-error/20 border-error/40 text-error"
                              : fraudResult?.risk_level === "MEDIUM"
                              ? "bg-[#78350f]/20 border-[#fbbf24]/40 text-[#fbbf24]"
                              : "bg-[#166534]/20 border-[#4ade80]/40 text-[#4ade80]"
                          }`}
                        >
                          {fraudResult?.risk_level ?? "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-surface-container rounded-2xl p-md border border-outline-variant/30 flex-1 flex flex-col justify-center">
                      <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">
                        Recommendation
                      </h4>
                      <p className="font-headline-md text-headline-md text-on-surface">
                        {decisionStyle.label}
                      </p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mt-sm">
                        Underwriting decision based on the latest analysis run.
                      </p>
                    </div>

                    <div className="bg-surface-container rounded-2xl p-md border border-outline-variant/30">
                      <div className="grid grid-cols-3 gap-sm text-center">
                        <div>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">
                            Run #
                          </p>
                          <p className="font-label-md text-label-md text-on-surface font-semibold">
                            {analysisCount || 1}
                          </p>
                        </div>
                        <div>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">
                            Application
                          </p>
                          <p className="font-label-md text-label-md text-on-surface font-semibold">
                            #{applicationId}
                          </p>
                        </div>
                        <div>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">
                            Last run
                          </p>
                          <p className="font-label-md text-label-md text-on-surface font-semibold">
                            {formatTime(lastAnalysisAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tab === "sources" && (
                <div className="bg-surface-container rounded-2xl p-md md:p-lg border border-outline-variant/30">
                  <div className="mb-lg">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-xs flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary-fixed">
                        database
                      </span>
                      Data Sources
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      The signals used to generate this analysis, based on the
                      consent you granted.
                    </p>
                  </div>
                  <div className="space-y-sm">
                    {sources.map((s) => (
                      <div
                        key={s.key}
                        className={`flex items-start justify-between p-md rounded-xl border transition-colors ${
                          s.enabled
                            ? "bg-surface-container-low border-outline-variant/20"
                            : "bg-surface-container-lowest border-outline-variant/10 opacity-70"
                        }`}
                      >
                        <div className="flex items-start gap-sm pr-md">
                          <div className="p-xs bg-surface-container-highest rounded-lg text-primary">
                            <span className="material-symbols-outlined">
                              {s.icon}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-body-md text-body-md font-semibold text-on-surface mb-1">
                              {s.title}
                            </h3>
                            <p className="font-label-md text-label-md text-on-surface-variant">
                              {s.desc}
                            </p>
                          </div>
                        </div>
                        <StatusChip enabled={s.enabled} required={s.required} />
                      </div>
                    ))}
                  </div>
                  <p className="mt-md font-label-sm text-label-sm text-on-surface-variant flex items-start gap-xs">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      info
                    </span>
                    <span>
                      Declining a source won't affect your traditional
                      bureau-based assessment — it only limits the alternative
                      signals available for this analysis.
                    </span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
