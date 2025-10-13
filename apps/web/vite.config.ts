import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, "../.."), [""]);

  return {
    plugins: [tanstackRouter({}), react(), tailwindcss()],
    resolve: {
      alias: {
        "@web": path.resolve(__dirname, "./src"),
        "@fusebox/api": path.resolve(__dirname, "../../apps/api/src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: `http://localhost:${env.BACKEND_PORT || 3001}`,
          changeOrigin: true,
        },
        "/api/ws": {
          target: `ws://localhost:${env.BACKEND_PORT || 3001}`,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  };
});
