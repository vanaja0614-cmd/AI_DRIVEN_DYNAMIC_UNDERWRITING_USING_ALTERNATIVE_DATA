import { createContext, useContext, useMemo, useState } from "react";

const ApplicationContext = createContext(null);

const initialState = {
  // Step 1: Application Form
  income: "",
  jobTitle: "",
  yearsEmployed: "",
  education: "",
  bureauScore: "",
  loanAmount: "",
  loanTerm: "",
  accountAgeYears: "",

  // Alternative-data / fraud signals (Step 1 — optional)
  monthlyTransactions: "",
  unusualTransactionRatio: "",
  loginFrequency: "",

  // Step 2: Consent Manager
  consent: {
    employmentSignals: true,
    professionalPresence: true,
    digitalSignals: false,
    publicData: false,
    // bureau baseline is always true and required — not user-toggleable
  },

  // Populated once the backend calls succeed
  customerId: null,
  applicationId: null,
  riskResult: null, // { risk_score, risk_level, decision }
  fraudResult: null, // { fraud_probability, risk_level }
  explanationResult: null, // { explanation: [...] }

  // Analysis runs
  refreshSignal: 0, // bumped every time a "Refresh Data" run is requested
  analysisCount: 0,
  lastAnalysisAt: null,
};

export function ApplicationProvider({ children }) {
  const [state, setState] = useState(initialState);

  const updateApplication = (fields) =>
    setState((prev) => ({ ...prev, ...fields }));

  const updateConsent = (fields) =>
    setState((prev) => ({
      ...prev,
      consent: { ...prev.consent, ...fields },
    }));

  const triggerRefresh = () =>
    setState((prev) => ({
      ...prev,
      refreshSignal: (prev.refreshSignal || 0) + 1,
    }));

  const reset = () => setState(initialState);

  const value = useMemo(
    () => ({ ...state, updateApplication, updateConsent, setState, triggerRefresh, reset }),
    [state]
  );

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const ctx = useContext(ApplicationContext);
  if (!ctx) {
    throw new Error("useApplication must be used within ApplicationProvider");
  }
  return ctx;
}
