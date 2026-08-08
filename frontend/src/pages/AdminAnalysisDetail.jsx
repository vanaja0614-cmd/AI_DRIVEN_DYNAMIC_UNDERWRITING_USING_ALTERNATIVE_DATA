import { Link, useParams } from "react-router-dom";

// NOTE: This screen's Stitch generation used a different sidebar
// (Overview / Underwriting / Risk Monitor / Data Sources) than every other
// admin page in this app (Application / Consent / Results / Compliance /
// Reporting — see components/layout/SideNav.jsx). That's a real
// inconsistency from generating screens in separate Stitch sessions.
// Recommend picking ONE nav structure and regenerating this sidebar to
// match before your demo — for now it's kept as its own local nav so this
// page still renders correctly.
const LOCAL_NAV = [
  { label: "Overview", icon: "dashboard" },
  { label: "Underwriting", icon: "analytics", active: true },
  { label: "Risk Monitor", icon: "security" },
  { label: "Data Sources", icon: "database" },
];

// This page also isn't wired to a real GET /applications/{id} response
// shaped like this (bureau-style trust score breakdown with named factors,
// fraud gauge, AI summary sentence). Your current RiskResponse schema only
// returns { risk_score, risk_level, decision } — extend the backend if you
// want this exact level of admin detail, or treat this page as illustrative
// of what a richer response could power.
const MOCK_ANALYSIS = {
  trustScore: 88,
  decision: "APPROVED",
  fraudProbability: 12,
  completedAt: "Oct 24, 2023 at 14:32 UTC",
  factors: [
    { label: "Digital Engagement", impact: 35, negative: false },
    { label: "Transaction History", impact: 25, negative: false },
    { label: "Social Stability", impact: 15, negative: false, secondary: true },
    { label: "Recent Inquiries", impact: -10, negative: true },
    { label: "Credit Utilization", impact: -5, negative: true },
  ],
  summary:
    "Approved based on strong digital engagement and consistent transaction history.",
};

export default function AdminAnalysisDetail() {
  const { id } = useParams();
  const a = MOCK_ANALYSIS;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      <aside className="hidden md:flex h-screen w-64 flex-col bg-surface-container border-r border-outline-variant fixed left-0 top-0 z-40 py-6 px-4">
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">shield_person</span>
          </div>
          <div>
            <h1 className="font-display-lg text-headline-md font-bold text-primary">TrustFlow AI</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Admin Console</p>
          </div>
        </div>
        <button className="mb-6 w-full py-2 px-4 bg-primary text-on-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors">
          <span className="material-symbols-outlined">add</span>
          New Analysis
        </button>
        <nav className="flex-1 space-y-2">
          {LOCAL_NAV.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                item.active
                  ? "bg-primary-container text-on-primary-container border-l-4 border-primary"
                  : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                {item.icon}
              </span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-outline-variant space-y-2">
          <a className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-lg px-4 py-3 transition-all" href="#">
            <span className="material-symbols-outlined">contact_support</span>
            <span className="font-label-md text-label-md">Support</span>
          </a>
          <a className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-lg px-4 py-3 transition-all" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-md text-label-md">Settings</span>
          </a>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 h-full overflow-y-auto bg-background p-margin-mobile md:p-margin-desktop">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/reporting" className="material-symbols-outlined text-outline-variant cursor-pointer hover:text-on-surface transition-colors">
                arrow_back
              </Link>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Application #{id ?? "TX-8921"}</h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">Analysis completed on {a.completedAt}</p>
          </div>
          <div className="flex items-center gap-3 bg-surface-container-high border border-outline-variant rounded-full px-4 py-2">
            <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-md text-label-md text-on-surface">Live Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-low border border-white/[0.08] rounded-2xl p-lg relative overflow-hidden group hover:border-white/[0.15] transition-colors">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle at top right, #29a195 0%, transparent 50%)" }}
              />
              <div className="flex justify-between items-start mb-6 z-10 relative">
                <h3 className="font-headline-md text-headline-md text-on-surface">Trust Score</h3>
                <span className="material-symbols-outlined text-on-surface-variant">info</span>
              </div>
              <div className="flex justify-center items-center relative py-4 z-10">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" fill="none" r="50" stroke="#1E293B" strokeWidth="12" />
                  <circle
                    cx="60"
                    cy="60"
                    fill="none"
                    r="50"
                    stroke="#6bd8cb"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={314.16}
                    strokeDashoffset={314.16 * (1 - a.trustScore / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display-lg text-display-lg text-on-surface">{a.trustScore}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">/ 100</span>
                </div>
              </div>
              <div className="flex justify-center mt-6 z-10 relative">
                <div className="bg-primary/10 border border-primary/20 px-6 py-3 rounded-full flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span className="font-headline-md text-headline-md text-primary tracking-wide">{a.decision}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low border border-white/[0.08] rounded-2xl p-md group hover:border-white/[0.15] transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">shield_person</span>
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface-variant">Fraud Probability</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-headline-md text-headline-md text-on-surface">{a.fraudProbability}%</span>
                    <span className="font-label-sm text-label-sm text-primary">Low Risk</span>
                  </div>
                </div>
              </div>
              <div className="w-16 h-8 bg-surface-container rounded-full overflow-hidden relative">
                <div className="absolute left-0 top-0 bottom-0 bg-primary" style={{ width: `${a.fraudProbability}%` }}></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-surface-container-low border border-white/[0.08] rounded-2xl p-lg flex-1 flex flex-col group hover:border-white/[0.15] transition-colors">
              <div className="mb-6">
                <h3 className="font-headline-md text-headline-md text-on-surface">Why this score?</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">Key factors influencing the current assessment.</p>
              </div>
              <div className="flex-1 flex flex-col justify-center space-y-6">
                {a.factors.map((f) => (
                  <div key={f.label} className="flex items-center gap-4">
                    <div className="w-40 font-label-md text-label-md text-on-surface-variant text-right shrink-0 truncate">
                      {f.label}
                    </div>
                    <div className="flex-1 h-2 bg-surface-container rounded-full relative flex items-center">
                      <div className="absolute left-1/2 w-[1px] h-4 bg-outline-variant/30 z-10"></div>
                      <div
                        className={`absolute h-full rounded-full ${
                          f.negative ? "right-1/2 bg-error rounded-l-full" : "left-1/2 rounded-r-full"
                        } ${!f.negative && f.secondary ? "bg-[#0EA5E9]" : !f.negative ? "bg-primary" : ""}`}
                        style={{ width: `${Math.abs(f.impact)}%` }}
                      ></div>
                    </div>
                    <div className={`w-12 font-label-sm text-label-sm text-right ${f.negative ? "text-error" : f.secondary ? "text-secondary" : "text-primary"}`}>
                      {f.impact > 0 ? "+" : ""}
                      {f.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl p-md flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary mt-1">auto_awesome</span>
              <div>
                <h4 className="font-label-md text-label-md text-on-surface mb-2">AI Summary</h4>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{a.summary}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
