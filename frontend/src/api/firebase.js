import client from "./client";

/**
 * Firebase Realtime Database is wired through the backend.
 * GET/POST /users/      -> Firebase "users" node (list / create)
 * DELETE /users/{id}    -> remove a user
 * GET/POST /firebase/analyses -> persisted analysis records
 */

export function listUsers() {
  return client.get("/users/").then((res) => res.data);
}

export function createUser(data) {
  return client.post("/users/", data).then((res) => res.data);
}

export function deleteUser(uid) {
  return client.delete(`/users/${uid}`).then((res) => res.data);
}

export function listAnalyses() {
  return client.get("/firebase/analyses").then((res) => res.data);
}

export function syncAnalysis(payload) {
  return client.post("/firebase/analyses", payload).then((res) => res.data);
}
