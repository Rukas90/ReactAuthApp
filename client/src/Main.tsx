import React from "react"
import ReactDOM from "react-dom/client"
import "./config/i18n"
import App from "./App.js"
import { BrowserRouter } from "react-router-dom"
import "./scss/main.css"

var element = document.getElementById("root")

if (element != null) {
  ReactDOM.createRoot(element).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
}
