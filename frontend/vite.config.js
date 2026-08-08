import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT || 5173),
      proxy: {
        // Forwards /api/* calls to your FastAPI backend during development.
        // Adjust the target (VITE_API_PROXY_TARGET) if your backend runs on
        // a different host or port.
        "/api": {
          target: env.VITE_API_PROXY_TARGET || "http://localhost:8000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
