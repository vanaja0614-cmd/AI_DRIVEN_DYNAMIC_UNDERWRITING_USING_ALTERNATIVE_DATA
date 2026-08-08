import { Link } from "react-router-dom";
import SideNav from "../components/layout/SideNav";

// NOTE: There is no backend endpoint yet for consent-withdrawal requests
// (no /consent/withdrawals route, no Withdrawal model). This page currently
// renders with the same sample data as the Stitch mockup. Once a backend
// route exists (e.g. GET /consent/withdrawals/{id} and a POST to act on it),
// replace the constants below with real fetched data and wire the action
// buttons to real mutations.
const MOCK_REQUEST = {
  customerId: "TF-9975",
  legalName: "Ananya Sharma",
  currentRiskScore: 72,
  modelVersion: "v2.4",
  submitted: "Oct 21, 2023",
  slaRemaining: "24h remaining",
  scopes: [
    {
      icon: "public_off",
      title: "Social Data Access",
      desc: "Revokes access to LinkedIn graph APIs and connected behavioral clustering models.",
    },
    {
      icon: "block",
      title: "Digital Footprint",
      desc: "Purges localized device telemetry and IP-based geolocation history vectors.",
    },
  ],
  confidencePenalty: 14,
  timeline: [
    { time: "Oct 10, 09:14 AM", label: "v1.2 Policy Accepted", current: false },
    { time: "Oct 10, 09:15 AM", label: "Social Data Granted", current: false },
    { time: "Oct 21, 14:30 PM", label: "Withdrawal Request Submitted", current: true },
  ],
};

export default function WithdrawalRequestDetail() {
  const r = MOCK_REQUEST;

  return (
    <div className="flex min-h-screen w-full bg-background text-on-background">
      <SideNav />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 flex justify-between items-center w-full px-margin-desktop py-4 h-20">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-64 group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-70 group-focus-within:text-primary transition-colors">
                search
              </span>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full py-2 pl-10 pr-4 text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/50"
                placeholder="Search records..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-margin-desktop pb-24 w-full max-w-7xl mx-auto flex flex-col gap-gutter">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <Link
                to="/compliance"
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md w-fit group"
              >
                <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
                  arrow_back
                </span>
                Back to Compliance Center
              </Link>
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  Withdrawal Request: {r.customerId}
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 border border-secondary-container/30 text-secondary font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                  Status: Pending Review
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Submitted: {r.submitted}
              </p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                SLA Deadline: <span className="text-error">{r.slaRemaining}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            {/* Left column */}
            <div className="lg:col-span-4 flex flex-col gap-gutter">
              <div className="bg-surface-container-low border border-outline-variant/10 rounded-lg p-md shadow-sm relative overflow-hidden group hover:border-outline-variant/30 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person</span>
                  Subject Profile
                </h3>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        Customer ID
                      </p>
                      <p className="font-label-md text-label-md text-on-surface font-bold mt-1">
                        {r.customerId}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">fingerprint</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        Legal Name
                      </p>
                      <p className="font-body-md text-body-md text-on-surface mt-1">{r.legalName}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        Current Risk Score
                      </p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                        Model {r.modelVersion}
                      </p>
                    </div>
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-surface-container-high"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="text-primary"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeDasharray={`${r.currentRiskScore}, 100`}
                          strokeLinecap="round"
                          strokeWidth="3"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-label-md text-label-md text-primary font-bold">
                        {r.currentRiskScore}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low border border-outline-variant/10 rounded-lg p-md shadow-sm">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">history</span>
                  Consent Timeline
                </h3>
                <div className="relative pl-4 border-l-2 border-surface-container-high space-y-6">
                  {r.timeline.map((t) => (
                    <div className="relative" key={t.label}>
                      <div
                        className={
                          t.current
                            ? "absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-secondary-container flex items-center justify-center border-[3px] border-background"
                            : "absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-surface-container-high border-2 border-background"
                        }
                      >
                        {t.current && <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>}
                      </div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-0.5">{t.time}</p>
                      <p
                        className={
                          t.current
                            ? "font-body-md text-body-md text-secondary font-medium"
                            : "font-body-md text-body-md text-on-surface"
                        }
                      >
                        {t.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-8 flex flex-col gap-gutter">
              <div className="bg-surface-container-low border border-outline-variant/10 rounded-lg p-md shadow-sm">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">data_object</span>
                  Targeted Scopes for Withdrawal
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-2xl">
                  The user has invoked their right to revoke access to the
                  following alternative data signals. These signals are
                  currently active in their underwriting profile.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {r.scopes.map((s) => (
                    <div
                      key={s.title}
                      className="bg-surface-container p-4 rounded-lg border border-outline-variant/20 flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-error-container/10 flex items-center justify-center text-error mt-0.5 shrink-0">
                        <span className="material-symbols-outlined">{s.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-label-md text-label-md text-on-surface mb-1">{s.title}</h4>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-low border border-error/20 rounded-lg p-md shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-error/5 to-transparent pointer-events-none"></div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2 relative z-10">
                  <span className="material-symbols-outlined text-error">warning</span>
                  Algorithmic Impact Summary
                </h3>
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <div className="flex-1">
                    <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                      Simulating the removal of these vectors against the
                      current underwriting model ({r.modelVersion}). Removing{" "}
                      <strong>Social Data Access</strong> and{" "}
                      <strong>Digital Footprint</strong> will degrade the
                      confidence score of the current assessment.
                    </p>
                    <div className="flex items-center gap-2 text-error font-label-md text-label-md">
                      <span className="material-symbols-outlined text-sm">trending_up</span>
                      Margin of Error Increase
                    </div>
                  </div>
                  <div className="shrink-0 text-center md:text-right">
                    <div className="font-display-lg text-display-lg text-error font-bold tracking-tight">
                      {r.confidencePenalty}%
                    </div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1 tracking-widest">
                      Confidence Penalty
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/20 p-4 px-margin-desktop z-40">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              Action requires Level 2 Compliance Auth
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors">
                Request More Info
              </button>
              <button className="flex-1 md:flex-none px-6 py-2.5 rounded-lg bg-surface-container-high text-primary font-label-md text-label-md hover:bg-surface-container-highest transition-colors border border-primary/20">
                Keep Active &amp; Notify User
              </button>
              <button className="flex-1 md:flex-none px-6 py-2.5 rounded-lg bg-error text-on-error font-label-md text-label-md font-semibold shadow-lg shadow-error/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
                Approve &amp; Wipe Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
