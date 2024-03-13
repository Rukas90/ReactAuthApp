import React, { ReactElement } from "react"
import { Routes, Route } from "react-router-dom"
import {
  HomeView,
  LoginView,
  RegisterView,
  VerifyView,
  Verify2FAView,
  OAuthIdentifyView,
} from "./Components/Views"
import useLanguageSetting from "./Hooks/useLanguageSetting"
import { usePreventWindowUnload } from "./Hooks/usePreventWindowUnload"
import { MessageProvider } from "./Contexts/MessageContext"
import { BusyProvider } from "./Contexts/BusyProvider"
import { DialogProvider } from "./Contexts/DialogContext"
import { NotificationsProvider } from "Contexts/NotificationsContexts"
import { AuthProvider } from "Contexts/AuthContext"

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
      <AuthProvider>
        <MessageProvider>
          <NotificationsProvider>
            <DialogProvider>
              <BusyProvider>
                <Routes>
                  <Route path="/" element={<HomeView />} />
                  <Route path="/login" element={<LoginView />} />
                  <Route path="/register" element={<RegisterView />} />
                  <Route path="/verify" element={<VerifyView />} />
                  <Route
                    path="/oauth-identify"
                    element={<OAuthIdentifyView />}
                  />
                  <Route path="/verify-2fa" element={<Verify2FAView />} />
                </Routes>
              </BusyProvider>
            </DialogProvider>
          </NotificationsProvider>
        </MessageProvider>
      </AuthProvider>
    </>
  )
}

export default App
