import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import inject from "@rollup/plugin-inject";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  build: {
    rollupOptions: {
      plugins: [inject({ Buffer: ["Buffer", "Buffer"] })],
    },
  },
});
