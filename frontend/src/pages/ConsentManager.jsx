
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApplication } from "../context/ApplicationContext";
import Toggle from "../components/ui/Toggle";
import { createApplication } from "../api/applications";
import { createCustomer } from "../api/customers";
import { saveConsent } from "../api/consent";

const CONSENT_ITEMS = [
  {
    key: "employmentSignals",
    icon: "school",
    title: "Employment & Education signals",
    desc: "Verify employer, tenure, and education verification data",
  },
  {
    key: "professionalPresence",
    icon: "badge",
    title: "Professional Presence",
    desc: "LinkedIn, professional network, and career history signals",
  },
  {
    key: "digitalSignals",
    icon: "devices",
    title: "Digital Engagement",
    desc: "App usage, login frequency, and online activity behavior",
  },
  {
    key: "publicData",
    icon: "public",
    title: "Publicly Available Information",
    desc: "Public records and other publicly accessible data sources",
  },
];

export default function ConsentManager() {
  const navigate = useNavigate();
  const {
    consent,
    updateConsent,
    name,
    email,
    income,
    jobTitle,
    yearsEmployed,
    education,
    bureauScore,
    loanAmount,
    loanTerm,
    setState,
  } = useApplication();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleBack = () => navigate("/application");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // Create a customer record (also mirrored to Firebase 'users' on the
      // backend) using the name/email collected on the Application Form.
      const customer = await createCustomer({
        name: name || jobTitle || "Applicant",
        email: email || `${(jobTitle || "applicant").toLowerCase().replace(/\s+/g, ".")}@example.com`,
        income: Number(income) || 0,
        credit_score: Number(bureauScore) || 0,
      });
      const customerId = customer.id;

      const application = await createApplication({
        customer_id: customerId,
        loan_amount: Number(loanAmount) || Number(income) || 0,
        loan_term: Number(loanTerm) || 12,
        employment_years: Number(yearsEmployed) || 0,
      });

      await saveConsent({
        customerId,
        employmentSignals: consent.employmentSignals,
        professionalPresence: consent.professionalPresence,
        digitalSignals: consent.digitalSignals,
        publicData: consent.publicData,
      });

      setState((prev) => ({
        ...prev,
        customerId,
        applicationId: application.id,
      }));

      navigate("/processing");
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Something went wrong submitting your application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-margin-mobile md:p-margin-desktop">
      <div className="w-full max-w-2xl">
        <div className="mb-xl">
          <div className="flex justify-between items-center mb-sm">
            <span className="font-label-md text-label-md text-on-surface-variant">
              Step 2 of 3
            </span>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
              Consent
            </span>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden flex gap-[2px]">
            <div className="h-full flex-1 bg-primary rounded-full shadow-[0_0_10px_rgba(107,216,203,0.5)]"></div>
            <div className="h-full flex-1 bg-primary rounded-full shadow-[0_0_10px_rgba(107,216,203,0.5)]"></div>
            <div className="h-full flex-1 bg-surface-container-highest rounded-full"></div>
          </div>
          <div className="flex justify-between mt-xs font-label-sm text-label-sm text-on-surface-variant">
            <span>Application</span>
            <span className="text-on-surface">Consent</span>
            <span>Results</span>
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/20 rounded-[24px] p-lg md:p-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

          <div className="mb-lg">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
              Manage Your Data Consent
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Choose which additional signals TrustFlow can use to assess you
              fairly.
            </p>
          </div>

          <div className="space-y-sm mb-xl">
            {CONSENT_ITEMS.map((item) => (
              <div
                key={item.key}
                className="flex items-start justify-between p-md bg-surface-container rounded-xl border border-outline-variant/10 hover:bg-surface-container-high transition-colors"
              >
                <div className="flex items-start gap-sm pr-md">
                  <div className="p-xs bg-surface-container-highest rounded-lg text-primary">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-body-md text-body-md font-semibold text-on-surface mb-1">
                      {item.title}
                    </h3>
                    <p className="font-label-md text-label-md text-on-surface-variant">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={consent[item.key]}
                  onChange={(val) => updateConsent({ [item.key]: val })}
                />
              </div>
            ))}

            {/* Required bureau baseline - always on, not toggleable */}
            <div className="flex items-start justify-between p-md bg-surface-container-low rounded-xl border border-outline-variant/20 opacity-80">
              <div className="flex items-start gap-sm pr-md">
                <div className="p-xs bg-surface-container-highest rounded-lg text-on-surface-variant">
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <div>
                  <div className="flex items-center gap-xs mb-1">
                    <h3 className="font-body-md text-body-md font-semibold text-on-surface">
                      Traditional Bureau baseline
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.5 bg-surface-variant text-on-surface-variant rounded uppercase font-bold tracking-tighter">
                      Required
                    </span>
                  </div>
                  <p className="font-label-md text-label-md text-on-surface-variant">
                    Credit bureau score and standard application details
                  </p>
                </div>
              </div>
              <Toggle checked={true} onChange={() => {}} disabled />
            </div>
          </div>

          <div className="pt-lg border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-md">
            <div className="flex-1 order-2 md:order-1 text-center md:text-left">
              <p className="font-label-sm text-label-sm text-on-surface-variant flex items-start gap-xs">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  info
                </span>
                <span>
                  You can change these preferences anytime. Declining a
                  toggle won't affect your traditional bureau-based
                  assessment.
                </span>
              </p>
            </div>
          </div>

          {error && (
            <p className="mt-md font-label-sm text-label-sm text-error">{error}</p>
          )}
        </div>

        <div className="mt-lg flex flex-row justify-between items-center w-full">
          <button
            onClick={handleBack}
            className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface px-md py-sm rounded-lg transition-colors flex items-center gap-xs"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="font-label-md text-label-md bg-primary text-on-primary-container px-lg py-sm rounded-lg font-semibold hover:bg-primary-fixed transition-colors flex items-center gap-xs shadow-[0_4px_14px_rgba(107,216,203,0.3)] disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Application"}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </main>
  );
}
