import React from "react"
import ReactDOM from "react-dom/client"
import "./config/i18n" // Importing i18n configuration for internationalization
import App from "./App.js"
import { BrowserRouter } from "react-router-dom" // Provides routing capabilities
import "./scss/main.css" // Global styles
import { LanguageProvider } from "./contexts/LanguageProvider" // Context provider for language settings
import { CsrfProvider } from "./contexts/CsrfContext"

// Find the root element in the HTML to mount the React application
var element = document.getElementById("root")

if (element != null) {
  // Rendering the React application inside the root element
  ReactDOM.createRoot(element).render(
    <React.StrictMode>
      <BrowserRouter>
        <CsrfProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </CsrfProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}
