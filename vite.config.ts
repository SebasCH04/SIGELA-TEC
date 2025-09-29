import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",        // accesible desde Windows (WSL)
    port: 8080,        // tu puerto actual del front
    proxy: {
      // TODO: todo lo que empiece con /api se proxea al backend (http://localhost:3000)
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        // ws: true,    // descomenta si usas websockets
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
}));
