import axios from "axios";

// In dev, Vite proxies /api/* to your FastAPI backend (see vite.config.js).
// In production, set VITE_API_BASE_URL to your deployed backend URL.
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
