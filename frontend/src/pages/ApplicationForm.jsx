import { useNavigate } from "react-router-dom";
import { useApplication } from "../context/ApplicationContext";

export default function ApplicationForm() {
  const navigate = useNavigate();
  const {
    income,
    jobTitle,
    yearsEmployed,
    education,
    bureauScore,
    loanAmount,
    loanTerm,
    accountAgeYears,
    monthlyTransactions,
    unusualTransactionRatio,
    loginFrequency,
    updateApplication,
  } = useApplication();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/consent");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-gutter relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] opacity-50 mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px] opacity-40 mix-blend-screen"></div>
      </div>

      <main className="relative z-10 w-full max-w-4xl mx-auto glass-panel rounded-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left info panel */}
        <aside className="hidden md:flex flex-col bg-surface-container/50 border-r border-outline-variant/10 w-1/3 p-xl justify-between">
          <div>
            <div className="flex items-center gap-3 mb-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-primary">
                  account_balance
                </span>
              </div>
              <div>
                <h1 className="font-headline-md text-headline-md font-bold text-primary">
                  TrustFlow AI
                </h1>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Precision Underwriting
                </p>
              </div>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">
              Start Your Application
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-xl leading-relaxed">
              Tell us about yourself — we'll combine this with alternative
              data for a fairer risk assessment.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary/70">
                  lock
                </span>
                <span className="font-label-md text-label-md">
                  Bank-grade encryption
                </span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary/70">
                  speed
                </span>
                <span className="font-label-md text-label-md">
                  Instant AI processing
                </span>
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <div className="text-xs text-on-surface-variant/50">
              Need help?{" "}
              <a className="text-primary hover:underline" href="#">
                Contact Support
              </a>
            </div>
          </div>
        </aside>

        {/* Form area */}
        <div className="w-full md:w-2/3 p-gutter md:p-xl flex flex-col">
          <div className="md:hidden mb-gutter text-center">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
              Start Your Application
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Tell us about yourself for a fairer risk assessment.
            </p>
          </div>

          <div className="mb-xl">
            <div className="flex justify-between items-center mb-sm">
              <span className="font-label-md text-label-md text-primary">
                Step 1 of 3
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Application → Consent → Results
              </span>
            </div>
            <div className="flex h-1 bg-surface-container-low rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full relative" style={{ width: "33%" }}>
                <div className="absolute inset-0 bg-white/20 blur-[2px]"></div>
              </div>
            </div>
          </div>

          <form className="flex-grow flex flex-col gap-gutter" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="space-y-sm">
                <label className="font-label-md text-label-md text-on-surface flex items-center gap-2" htmlFor="income">
                  Annual Income
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center font-label-md text-label-md text-on-surface-variant opacity-50">
                    $
                  </span>
                  <input
                    className="input-base pl-8 w-full font-label-md text-label-md"
                    id="income"
                    placeholder="0.00"
                    required
                    type="number"
                    value={income}
                    onChange={(e) => updateApplication({ income: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-sm">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="job-title">
                  Job Title
                </label>
                <input
                  className="input-base font-body-md text-body-md"
                  id="job-title"
                  placeholder="e.g. Software Engineer"
                  required
                  type="text"
                  value={jobTitle}
                  onChange={(e) => updateApplication({ jobTitle: e.target.value })}
                />
              </div>

              <div className="space-y-sm">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="years-employed">
                  Years Employed
                </label>
                <div className="relative">
                  <input
                    className="input-base font-label-md text-label-md"
                    id="years-employed"
                    min="0"
                    placeholder="0"
                    required
                    step="0.5"
                    type="number"
                    value={yearsEmployed}
                    onChange={(e) => updateApplication({ yearsEmployed: e.target.value })}
                  />
                  <span className="absolute inset-y-0 right-0 pr-4 flex items-center font-label-md text-label-md text-on-surface-variant opacity-50 pointer-events-none">
                    Yrs
                  </span>
                </div>
              </div>

              <div className="space-y-sm">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="education">
                  Qualification Level
                </label>
                <div className="relative">
                  <select
                    className="input-base font-body-md text-body-md appearance-none cursor-pointer"
                    id="education"
                    required
                    value={education}
                    onChange={(e) => updateApplication({ education: e.target.value })}
                  >
                    <option disabled value="">
                      Select level...
                    </option>
                    <option value="high_school">High School Diploma</option>
                    <option value="associates">Associate's Degree</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="doctorate">Doctorate / PhD</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-gutter border-t border-outline-variant/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div className="space-y-sm">
                  <label className="font-label-md text-label-md text-on-surface flex justify-between items-end" htmlFor="loan-amount">
                    Loan Amount
                    <span className="font-label-sm text-label-sm text-on-surface-variant opacity-70">Required</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center font-label-md text-label-md text-on-surface-variant opacity-50">
                      $
                    </span>
                    <input
                      className="input-base pl-8 font-label-md text-label-md"
                      id="loan-amount"
                      placeholder="0.00"
                      required
                      type="number"
                      value={loanAmount}
                      onChange={(e) => updateApplication({ loanAmount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-sm">
                  <label className="block font-label-md text-label-md text-on-surface flex justify-between items-end" htmlFor="loan-term">
                    Loan Term
                    <span className="font-label-sm text-label-sm text-on-surface-variant opacity-70">Required</span>
                  </label>
                  <div className="relative">
                    <input
                      className="input-base font-label-md text-label-md"
                      id="loan-term"
                      min="1"
                      placeholder="e.g. 12"
                      required
                      type="number"
                      value={loanTerm}
                      onChange={(e) => updateApplication({ loanTerm: e.target.value })}
                    />
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center font-label-md text-label-md text-on-surface-variant opacity-50 pointer-events-none">
                      Months
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-gutter border-t border-outline-variant/10">
              <div className="flex items-center justify-between mb-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-fixed text-lg">query_stats</span>
                  <label className="font-label-md text-label-md font-bold text-on-surface">
                    Alternative Data Signals
                  </label>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant opacity-70">
                  Optional — used for fraud + digital scoring when consented
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                <div className="space-y-sm">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="account-age">
                    Account Age
                  </label>
                  <div className="relative">
                    <input
                      className="input-base font-label-md text-label-md"
                      id="account-age"
                      min="0"
                      placeholder="e.g. 5"
                      type="number"
                      value={accountAgeYears}
                      onChange={(e) => updateApplication({ accountAgeYears: e.target.value })}
                    />
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center font-label-md text-label-md text-on-surface-variant opacity-50 pointer-events-none">
                      Yrs
                    </span>
                  </div>
                </div>

                <div className="space-y-sm">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="monthly-transactions">
                    Monthly Transactions
                  </label>
                  <input
                    className="input-base font-label-md text-label-md"
                    id="monthly-transactions"
                    min="0"
                    placeholder="e.g. 38"
                    type="number"
                    value={monthlyTransactions}
                    onChange={(e) => updateApplication({ monthlyTransactions: e.target.value })}
                  />
                </div>

                <div className="space-y-sm">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="unusual-ratio">
                    Unusual Trans. Ratio
                  </label>
                  <div className="relative">
                    <input
                      className="input-base font-label-md text-label-md"
                      id="unusual-ratio"
                      max="1"
                      min="0"
                      placeholder="e.g. 0.05"
                      step="0.01"
                      type="number"
                      value={unusualTransactionRatio}
                      onChange={(e) => updateApplication({ unusualTransactionRatio: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-sm">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="login-frequency">
                    Daily Logins
                  </label>
                  <input
                    className="input-base font-label-md text-label-md"
                    id="login-frequency"
                    min="0"
                    placeholder="e.g. 5"
                    type="number"
                    value={loginFrequency}
                    onChange={(e) => updateApplication({ loginFrequency: e.target.value })}
                  />
                </div>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70 mt-sm">
                We only use these signals if you grant consent on the next step.
              </p>
            </div>

            <div className="pt-gutter border-t border-outline-variant/10">
              <div className="space-y-sm w-full md:w-1/2">
                <label className="font-label-md text-label-md text-on-surface flex justify-between items-end" htmlFor="bureau-score">
                  Bureau Score
                </label>
                <div className="relative group">
                  <input
                    className="input-base font-label-md text-label-md"
                    id="bureau-score"
                    max="900"
                    min="300"
                    placeholder="Ex: 720"
                    required
                    type="number"
                    value={bureauScore}
                    onChange={(e) => updateApplication({ bureauScore: e.target.value })}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span
                      className="material-symbols-outlined text-outline-variant/50 group-focus-within:text-primary/50"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      av_timer
                    </span>
                  </div>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70">
                  Used as baseline comparison. Range: 300–900.
                </p>
              </div>
            </div>

            <div className="mt-xl flex justify-end items-center pt-md">
              <button
                className="group relative flex items-center gap-3 bg-primary text-on-primary px-lg py-3 rounded-lg font-label-md text-label-md font-bold overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
                type="submit"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10">Next: Consent</span>
                <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
