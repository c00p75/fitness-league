import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@fitness-league/shared": path.resolve(__dirname, "../../packages/shared/src"),
      "@fitness-league/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@fitness-league/env": path.resolve(__dirname, "../../packages/env/src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:5173",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
});