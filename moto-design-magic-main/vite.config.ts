import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    tailwindcss(),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
