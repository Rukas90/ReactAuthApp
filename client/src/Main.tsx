import React from "react"
import ReactDOM from "react-dom/client"
import "./Config/i18n" // Importing i18n configuration for internationalization
import App from "./App.js"
import { BrowserRouter } from "react-router-dom"
import "./Scss/main.css" // Global styles
import { LanguageProvider } from "./Contexts/LanguageProvider" // Context provider for language settings
import "leaflet/dist/leaflet.css" // Import leaflet styling

// Find the root element in the HTML to mount the React application
var element = document.getElementById("root")

if (element != null) {
  // Rendering the React application inside the root element
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
