import { AuthGuard } from "Components/AuthGuard"
import {
  HomeView,
  LoginView,
  RegisterView,
  VerifyView,
  OAuthIdentifyView,
  Verify2FAView,
} from "Components/Views"
import React from "react"
import { Routes, Route } from "react-router-dom"

export const AppRouter = () => {
  return (
    <AuthGuard>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/verify-account" element={<VerifyView />} />
        <Route path="/oauth-identify" element={<OAuthIdentifyView />} />
        <Route path="/verify-2fa" element={<Verify2FAView />} />
      </Routes>
    </AuthGuard>
  )
}
export default AppRouter
