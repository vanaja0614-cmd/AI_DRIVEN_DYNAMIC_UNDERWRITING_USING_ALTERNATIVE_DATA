import client from "./client";

/**
 * POST /risk/score
 * body: RiskRequest {
 *   application_id, income, credit_score, loan_amount, loan_term,
 *   employment_years, digital_activity_score, transaction_consistency
 * }
 * returns: RiskResponse { application_id, risk_score, risk_level, decision }
 */
export function scoreRisk(data) {
  return client.post("/risk/score", data).then((res) => res.data);
}
