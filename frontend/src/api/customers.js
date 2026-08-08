import client from "./client";

/**
 * POST /customers/
 * body: { name, email, income, credit_score }
 * returns: CustomerResponse { id, name, email, income, credit_score }
 */
export function createCustomer(data) {
  return client.post("/customers/", data).then((res) => res.data);
}

/**
 * GET /customers/{customer_id}
 */
export function getCustomer(customerId) {
  return client.get(`/customers/${customerId}`).then((res) => res.data);
}
