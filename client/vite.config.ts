import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["192.168.1.119.nip.io"],
  },
  resolve: {
    alias: {
      "#services": path.resolve(__dirname, "./src/services"),
      "#icons": path.resolve(__dirname, "./src/imgs/icons"),
      "#types": path.resolve(__dirname, "./src/types"),
      "#lib": path.resolve(__dirname, "./src/lib"),
      "#routes": path.resolve(__dirname, "./src/routes"),
      "#features": path.resolve(__dirname, "./src/features"),
      "#locales": path.resolve(__dirname, "./src/lib/locales"),
      "#auth": path.resolve(__dirname, "./src/features/auth"),
      "#dashboard": path.resolve(__dirname, "./src/features/dashboard"),
      "#shared": path.resolve(__dirname, "./src/features/shared"),
      "#ui": path.resolve(__dirname, "./src/features/shared/ui"),
      "#hooks": path.resolve(__dirname, "./src/features/shared/hooks"),
    },
  },
})
