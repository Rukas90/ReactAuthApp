import React from "react"
import { Routes, Route } from "react-router-dom"
import HomeView from "./views/HomeView"
import LoginView from "./views/LoginView"
import RegisterView from "./views/RegisterView"
import useLanguageSetting from "./hooks/useLanguageSetting"
import VerifyView from "./views/VerifyView"
import { MessageProvider } from "./contexts/MessageContext"

/**
 * App Component
 *
 * The main component that orchestrates the routing and language settings of the application.
 *
 * Features:
 * - Utilizes the `useLanguageSetting` hook to manage language preferences across the application.
 * - Defines routes for different pages using react-router-dom.
 */
const App = () => {
  useLanguageSetting() // Initialize language settings

  return (
    <>
      <MessageProvider>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/verify" element={<VerifyView />} />
        </Routes>
      </MessageProvider>
    </>
  )
}

export default App
