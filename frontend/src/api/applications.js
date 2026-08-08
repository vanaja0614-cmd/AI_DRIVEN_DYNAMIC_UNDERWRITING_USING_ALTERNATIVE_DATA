import client from "./client";

/**
 * POST /applications/
 * body: { customer_id, loan_amount, loan_term, employment_years }
 * returns: ApplicationResponse { id, status, ...body }
 */
export function createApplication(data) {
  return client.post("/applications/", data).then((res) => res.data);
}

/**
 * GET /applications/{application_id}
 */
export function getApplication(applicationId) {
  return client
    .get(`/applications/${applicationId}`)
    .then((res) => res.data);
}
