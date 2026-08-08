import { useCallback } from "react";
import { useApplication } from "../context/ApplicationContext";
import { scoreRisk } from "../api/risk";
import { checkFraud } from "../api/fraud";
import { explain } from "../api/explanations";

/**
 * Runs the risk score, fraud check, and explanation calls together and
 * stores the results in ApplicationContext. Used by both the Processing
 * screen (which runs it once, up front, while showing the loading
 * animation) and the Results Dashboard (as a fallback if someone lands
 * there directly without going through Processing).
 */
export function useRunAnalysis() {
  const {
    applicationId,
    income,
    bureauScore,
    yearsEmployed,
    loanAmount,
    loanTerm,
    accountAgeYears,
    monthlyTransactions,
    unusualTransactionRatio,
    loginFrequency,
    consent,
    setState,
  } = useApplication();

  const run = useCallback(async () => {
    if (!applicationId) {
      throw new Error(
        "No application found yet. Please complete the application and consent steps first."
      );
    }

    const accountAgeDays = Math.round((Number(accountAgeYears) || 0) * 365);

    // Derive digital-behavior scores from the consented signals. Any data
    // the applicant did NOT consent to is ignored (treated as neutral).
    const digitalSignals = Boolean(consent?.digitalSignals);
    const transactionSignals = Boolean(consent?.publicData);
    const employmentSignals =
      Boolean(consent?.employmentSignals) || Boolean(consent?.professionalPresence);

    const digitalActivityScore = digitalSignals
      ? Math.min(1, (Number(monthlyTransactions) || 0) / 100)
      : 0;

    const transactionConsistency = transactionSignals
      ? Math.max(0, 1 - (Number(unusualTransactionRatio) || 0))
      : 0;

    const employmentStability = employmentSignals
      ? Math.min(1, (Number(yearsEmployed) || 0) / 10)
      : 0;

    const blendedIncome = Number(income) || 0;
    const effectiveIncome =
      blendedIncome + employmentStability * 5000;

    const features = {
      application_id: applicationId,
      income: Number(effectiveIncome) || 0,
      credit_score: Number(bureauScore) || 0,
      loan_amount: Number(loanAmount) || Number(income) || 0,
      loan_term: Number(loanTerm) || 12,
      employment_years: Number(yearsEmployed) || 0,
      digital_activity_score: digitalActivityScore,
      transaction_consistency: transactionConsistency,
    };

    const fraudInputs = {
      application_id: applicationId,
      transaction_count: Number(monthlyTransactions) || 0,
      unusual_transaction_ratio: Number(unusualTransactionRatio) || 0,
      account_age_days: accountAgeDays,
      login_frequency: Number(loginFrequency) || 0,
    };

    const [risk, fraud, explanation] = await Promise.all([
      scoreRisk(features),
      checkFraud(fraudInputs),
      explain(features),
    ]);

    setState((prev) => ({
      ...prev,
      riskResult: risk,
      fraudResult: fraud,
      explanationResult: explanation,
      analysisCount: (prev.analysisCount || 0) + 1,
      lastAnalysisAt: new Date().toISOString(),
    }));

    return { risk, fraud, explanation };
  }, [
    applicationId,
    income,
    bureauScore,
    yearsEmployed,
    loanAmount,
    loanTerm,
    accountAgeYears,
    monthlyTransactions,
    unusualTransactionRatio,
    loginFrequency,
    consent,
    setState,
  ]);

  return run;
}
