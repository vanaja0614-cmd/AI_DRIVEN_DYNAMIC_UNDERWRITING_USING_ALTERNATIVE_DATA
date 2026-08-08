import client from "./client";

/** GET /monitoring/status */
export function getSystemStatus() {
  return client.get("/monitoring/status").then((res) => res.data);
}

/** GET /monitoring/self-check */
export function runSelfCheck() {
  return client.get("/monitoring/self-check").then((res) => res.data);
}

/** GET /health/ */
export function getHealth() {
  return client.get("/health/").then((res) => res.data);
}
