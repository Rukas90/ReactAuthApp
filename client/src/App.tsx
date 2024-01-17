import React from "react"
import { Routes, Route } from "react-router-dom"
import {
  HomeView,
  LoginView,
  RegisterView,
  VerifyView,
} from "./components/views"
import useLanguageSetting from "./hooks/useLanguageSetting"
import { usePreventWindowUnload } from "./hooks/usePreventWindowUnload"
import { MessageProvider } from "./contexts/MessageContext"
import { BusyProvider } from "./contexts/BusyProvider"
import { DialogProvider } from "./contexts/DialogContext"

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
  usePreventWindowUnload()

  return (
    <>
      <MessageProvider>
        <DialogProvider>
          <BusyProvider>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/register" element={<RegisterView />} />
              <Route path="/verify" element={<VerifyView />} />
            </Routes>
          </BusyProvider>
        </DialogProvider>
      </MessageProvider>
    </>
  )
}

export default App
