import { useEffect, useState } from "react";
import SideNav from "../components/layout/SideNav";
import { analyzeFairness, getCohortSummary } from "../api/fairness";

// Sample cohort data shown until real portfolio-level predictions/groups
// are available to send to POST /fairness/analyze. That endpoint expects
// per-applicant predictions + group labels (not pre-aggregated rates), so
// wiring this up for real needs a backend endpoint that returns aggregated
// cohort stats directly — e.g. GET /fairness/cohort-summary.
const COHORTS = [
  { name: "Group A (Baseline)", apps: "12,450", approval: "92.1%", variance: "-", flagged: false, baseline: true },
  { name: "Group B", apps: "8,210", approval: "85.4%", variance: "-6.7%", flagged: false, baseline: false },
  { name: "Group C", apps: "15,002", approval: "88.9%", variance: "-3.2%", flagged: false, baseline: false },
  { name: "Group D", apps: "4,190", approval: "81.2%", variance: "-10.9%", flagged: false, baseline: false },
  { name: "Group E (Review Required)", apps: "2,840", approval: "72.5%", variance: "-19.6%", flagged: true, baseline: false },
];

const SYSTEM_HEALTH = [
  { label: "Gateway API", icon: "api", status: "healthy" },
  { label: "Main DB Cluster", icon: "storage", status: "healthy" },
  { label: "Risk Model v4", icon: "psychology", status: "degraded" },
  { label: "Fraud Detection", icon: "policy", status: "healthy" },
];

export default function FairnessReports() {
  const [checking, setChecking] = useState(false);
  const [liveResult, setLiveResult] = useState(null);
  const [cohorts, setCohorts] = useState(COHORTS);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getCohortSummary()
      .then((data) => {
        setSummary(data);
        if (data?.cohorts?.length) {
          setCohorts(
            data.cohorts.map((c) => ({
              name: c.name,
              apps: c.apps.toLocaleString(),
              approval: c.approval,
              variance: c.variance,
              flagged: c.flagged,
              baseline: c.variance === "Baseline",
            }))
          );
        }
      })
      .catch(() => {
        // Keep the sample cohort table when the backend is unavailable.
      });
  }, []);

  const runLiveCheck = async () => {
    setChecking(true);
    try {
      const cohortStats = summary?.cohorts?.length
        ? summary.cohorts
        : [
            { approval_value: 0.92, apps: 12450, name: "Group A" },
            { approval_value: 0.854, apps: 8210, name: "Group B" },
            { approval_value: 0.889, apps: 15002, name: "Group C" },
            { approval_value: 0.812, apps: 4190, name: "Group D" },
            { approval_value: 0.725, apps: 2840, name: "Group E" },
          ];
      const predictions = cohortStats.flatMap((c) =>
        Array(Math.max(1, Math.round((c.apps || 100) / 100))).fill(
          c.approval_value >= 0.85 ? 1 : 0
        )
      );
      const expandedGroups = cohortStats.flatMap((c) =>
        Array(Math.max(1, Math.round((c.apps || 100) / 100))).fill(c.name)
      );
      const result = await analyzeFairness(predictions, expandedGroups);
      setLiveResult(result);
    } catch {
      setLiveResult({ error: "Live fairness check failed." });
    } finally {
      setChecking(false);
    }
  };

  const barHeights = cohorts.map((c, i) => ({
    label: c.name.split(": ").pop().trim(),
    value: Number(c.approval.replace("%", "")) || 0,
    flagged: c.flagged,
  }));

  return (
    <div className="flex h-screen overflow-hidden bg-surface font-body-md text-on-surface">
      <SideNav />

      <main className="flex-1 md:ml-64 h-full overflow-y-auto bg-surface relative">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0"></div>
        <div className="p-margin-mobile md:p-margin-desktop max-w-[1600px] mx-auto relative z-10 flex flex-col gap-gutter">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="font-display-lg text-headline-lg font-bold text-on-surface">
                Fairness &amp; Bias Monitoring
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
                Real-time tracking of algorithmic parity and disparate impact
                metrics across protected groups. Data synced hourly.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 bg-surface-container-highest px-3 py-1.5 rounded-full border border-outline-variant font-label-sm text-label-sm text-on-surface-variant">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                Live Monitor Active
              </span>
              <button className="bg-surface-variant hover:bg-surface-bright text-on-surface p-2 rounded-lg border border-outline-variant transition-colors">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Disparate Impact Ratio */}
            <div className="lg:col-span-1 bg-surface-container rounded-2xl p-md border border-white/[0.08] flex flex-col justify-between relative overflow-hidden group hover:border-white/[0.15] hover:bg-surface-container-highest transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    Disparate Impact Ratio
                  </h3>
                  <span className="material-symbols-outlined text-outline">scale</span>
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="font-display-lg text-display-lg text-on-surface font-bold">89.4%</span>
                </div>
                <p className="font-label-sm text-label-sm text-primary mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  +2.1% from last month
                </p>
              </div>
              <div className="mt-8">
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-2">
                  <span>Threshold: 80% (Four-Fifths Rule)</span>
                  <span className="text-primary font-bold">Passing</span>
                </div>
                <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden relative">
                  <div className="absolute left-[80%] top-0 bottom-0 w-px bg-error z-10"></div>
                  <div className="h-full bg-primary rounded-full" style={{ width: "89.4%" }}></div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="lg:col-span-2 bg-surface-container rounded-2xl p-md border border-white/[0.08] group hover:border-white/[0.15] transition-all duration-300">
              <div className="flex items-center justify-between mb-6 border-b border-outline-variant pb-4">
                <h3 className="font-headline-md text-headline-md text-on-surface">System Health</h3>
                <a className="font-label-sm text-label-sm text-primary hover:text-primary-fixed transition-colors flex items-center gap-1" href="#">
                  View Logs <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SYSTEM_HEALTH.map((s) => {
                  const healthy = s.status === "healthy";
                  return (
                    <div
                      key={s.label}
                      className={`bg-surface-variant/50 rounded-xl p-4 flex flex-col items-center justify-center text-center border relative overflow-hidden ${
                        healthy ? "border-outline-variant/30" : "border-error/30"
                      }`}
                    >
                      {!healthy && <div className="absolute inset-0 bg-error/5 pointer-events-none" />}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${healthy ? "bg-primary/10" : "bg-error/10"}`}>
                        <span className={`material-symbols-outlined ${healthy ? "text-primary" : "text-error"}`}>{s.icon}</span>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface mb-2">{s.label}</span>
                      <span
                        className={`font-label-sm text-label-sm px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                          healthy
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-error/10 text-error border-error/30"
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${healthy ? "bg-primary" : "bg-error animate-pulse"}`} />
                        {healthy ? "Healthy" : "Degraded"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
            {/* Approval rate bar chart */}
            <div className="bg-surface-container rounded-2xl p-md border border-white/[0.08] flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Approval Rates by Demographic</h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Trailing 30 Days</p>
                </div>
                <button
                  onClick={runLiveCheck}
                  disabled={checking}
                  className="font-label-sm text-label-sm text-primary hover:text-primary-fixed transition-colors disabled:opacity-50"
                >
                  {checking ? "Checking..." : "Run live check"}
                </button>
              </div>
              <div className="flex-1 relative mt-4">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 opacity-5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-full border-b border-white"></div>
                  ))}
                </div>
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between font-label-sm text-label-sm text-on-surface-variant -ml-8 text-right w-6">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                <div className="absolute inset-0 left-4 bottom-8 flex items-end justify-around z-10 gap-2">
                  {barHeights.map((bar) => (
                    <div key={bar.label} className="w-full max-w-[40px] flex flex-col items-center group relative cursor-pointer">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-300 ${
                          bar.flagged ? "bg-error group-hover:opacity-80" : "bg-primary group-hover:bg-primary-fixed"
                        }`}
                        style={{ height: `${bar.value}%` }}
                      ></div>
                      <span className="absolute -bottom-6 font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
                        {bar.label}
                      </span>
                      <div
                        className={`absolute -top-10 bg-surface-container-highest border border-outline-variant px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-label-md text-label-md z-20 ${
                          bar.flagged ? "text-error" : "text-on-surface"
                        }`}
                      >
                        {bar.value}%{bar.flagged ? " (Flagged)" : ""}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-8 left-4 right-0 border-b border-outline-variant z-10"></div>
              </div>
              {liveResult && (
                <pre className="mt-4 text-[10px] text-on-surface-variant bg-surface-container-low rounded-lg p-2 overflow-auto max-h-24">
                  {JSON.stringify(liveResult, null, 2)}
                </pre>
              )}
            </div>

            {/* Cohort table */}
            <div className="bg-surface-container rounded-2xl p-0 border border-white/[0.08] flex flex-col h-[500px] overflow-hidden">
              <div className="p-md border-b border-outline-variant flex items-center justify-between bg-surface-container sticky top-0 z-10">
                <h3 className="font-headline-md text-headline-md text-on-surface">Demographic Cohort Analysis</h3>
                <button className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-highest/50 border-b border-outline-variant">
                      <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant font-medium">Demographic Group</th>
                      <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant font-medium">Total Apps</th>
                      <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant font-medium text-right">Approval Rate</th>
                      <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant font-medium text-right">Variance to Mean</th>
                      <th className="py-3 px-4 font-label-sm text-label-sm text-on-surface-variant font-medium text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/50 font-label-md text-label-md text-on-surface">
                    {cohorts.map((c) => (
                      <tr
                        key={c.name}
                        className={`hover:bg-surface-variant/30 transition-colors group ${
                          c.flagged ? "bg-error/5 border-l-2 border-l-error" : ""
                        }`}
                      >
                        <td className={`py-4 px-4 font-body-md text-body-md ${c.flagged ? "text-error" : ""}`}>{c.name}</td>
                        <td className="py-4 px-4 text-on-surface-variant">{c.apps}</td>
                        <td className={`py-4 px-4 text-right ${c.flagged ? "font-bold" : ""}`}>{c.approval}</td>
                        <td className={`py-4 px-4 text-right ${c.baseline ? "text-on-surface-variant" : "text-error"} ${c.flagged ? "font-bold" : ""}`}>
                          {c.variance}
                        </td>
                        <td className="py-4 px-4 text-center flex justify-center">
                          {c.flagged ? (
                            <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                          ) : (
                            <span className={`inline-block w-2 h-2 rounded-full ${c.baseline ? "bg-outline-variant" : "bg-primary"}`}></span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
