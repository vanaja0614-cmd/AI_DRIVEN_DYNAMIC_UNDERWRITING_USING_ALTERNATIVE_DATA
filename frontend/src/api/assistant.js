import client from "./client";

/**
 * POST /assistant/chat  { message, application_id }
 * returns { reply, intent, agent }
 */
export function sendChat(message, applicationId) {
  return client
    .post("/assistant/chat", {
      message,
      application_id: applicationId,
    })
    .then((res) => res.data);
}

/** GET /assistant/agents */
export function getAgents() {
  return client.get("/assistant/agents").then((res) => res.data);
}
