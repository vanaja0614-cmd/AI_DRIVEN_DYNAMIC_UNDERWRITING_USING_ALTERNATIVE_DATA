import client from "./client";

/**
 * POST /explanations/
 * body: { features: { ...arbitrary feature dict... } }
 * returns: { explanation: [{ feature, impact, direction }, ...] }
 */
export function explain(features) {
  return client.post("/explanations/", features).then((res) => res.data);
}
