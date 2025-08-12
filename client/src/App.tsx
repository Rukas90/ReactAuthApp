import React from "react"
import useLanguageSetting from "./Hooks/useLanguageSetting"
import { usePreventWindowUnload } from "./Hooks/usePreventWindowUnload"
import { MessageProvider } from "./Contexts/MessageContext"
import { BusyProvider } from "./Contexts/BusyProvider"
import { DialogProvider } from "./Contexts/DialogContext"
import { NotificationsProvider } from "Contexts/NotificationsContexts"
import { AuthProvider } from "Contexts/AuthContext"
import AppRouter from "./AppRouter"

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
                <AppRouter />
              </BusyProvider>
            </DialogProvider>
          </NotificationsProvider>
        </MessageProvider>
      </AuthProvider>
    </>
  )
}

export default App
