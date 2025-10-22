import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@fitness-league/shared": path.resolve(__dirname, "../../packages/shared/src"),
      "@fitness-league/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@fitness-league/env": path.resolve(__dirname, "../../packages/env/src"),
    },
  },
});