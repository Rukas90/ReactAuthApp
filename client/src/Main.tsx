import React from "react"
import ReactDOM from "react-dom/client"
import "./config/i18n"
import App from "./App.js"
import { BrowserRouter } from "react-router-dom"
import "./scss/main.css"
import { LanguageProvider } from "./contexts/LanguageProvider"

var element = document.getElementById("root")

if (element != null) {
  ReactDOM.createRoot(element).render(
    <React.StrictMode>
      <BrowserRouter>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}
