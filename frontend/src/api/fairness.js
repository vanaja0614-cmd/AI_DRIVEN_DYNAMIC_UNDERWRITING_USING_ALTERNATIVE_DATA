import client from "./client";

/**
 * POST /fairness/analyze
 * body: { predictions: number[], groups: string[] }
 */
export function analyzeFairness(predictions, groups) {
  return client
    .post("/fairness/analyze", { predictions, groups })
    .then((res) => res.data);
}

/**
 * GET /fairness/cohort-summary
 * returns {
 *   cohorts: [{ name, apps, approval, variance, flagged }],
 *   total, baseline, baseline_approval, generated_at
 * }
 */
export function getCohortSummary() {
  return client.get("/fairness/cohort-summary").then((res) => res.data);
}
