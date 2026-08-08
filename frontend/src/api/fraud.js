import client from "./client";

/**
 * POST /fraud/check
 * body: FraudRequest {
 *   application_id, transaction_count, unusual_transaction_ratio,
 *   account_age_days, login_frequency
 * }
 * returns: FraudResponse { application_id, fraud_probability, risk_level }
 *
 * NOTE: none of these 4 inputs are collected on the Application Form.
 * Until you add fields to capture them (or derive them server-side from
 * consented alternative data), the frontend sends reasonable placeholder
 * values — see ResultsDashboard.jsx.
 */
export function checkFraud(data) {
  return client.post("/fraud/check", data).then((res) => res.data);
}
