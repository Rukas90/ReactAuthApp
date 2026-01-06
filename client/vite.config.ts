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
      "#requests": path.resolve(__dirname, "./src/requests"),
      "#types": path.resolve(__dirname, "./src/types"),
      "#icons": path.resolve(__dirname, "./src/imgs/icons"),
      "#hooks": path.resolve(__dirname, "./src/hooks"),
      "#contexts": path.resolve(__dirname, "./src/contexts"),
      "#schemas": path.resolve(__dirname, "./src/schemas"),
      "#lib": path.resolve(__dirname, "./src/lib"),
      "#locales": path.resolve(__dirname, "./src/locales"),
      "#views": path.resolve(__dirname, "./src/components/views"),
      "#common": path.resolve(__dirname, "./src/components/ui/common"),
      "#buttons": path.resolve(__dirname, "./src/components/ui/buttons"),
      "#labels": path.resolve(__dirname, "./src/components/ui/labels"),
      "#fields": path.resolve(__dirname, "./src/components/ui/fields"),
      "#texts": path.resolve(__dirname, "./src/components/ui/texts"),
      "#toggles": path.resolve(__dirname, "./src/components/ui/toggles"),
    },
  },
})
