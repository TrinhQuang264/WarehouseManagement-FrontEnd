import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.js",
    },
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          // Ưu tiên lấy từ .env, fallback nếu không có
          target: process.env.VITE_BACKEND_ORIGIN,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});