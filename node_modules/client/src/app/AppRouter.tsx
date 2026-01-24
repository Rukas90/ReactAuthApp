import { Navigate, Route, Routes } from "react-router-dom"
import {
  LoginView,
  RegisterView,
  ProtectedRoute,
  GuestOnlyRoute,
  ForwardRoute,
  useAuthContext,
  useTokenRefresh,
} from "@features/auth"
import {
  DashboardView,
  SecuritySettings,
  ActivitySettings,
  PreferenceSettings,
  AccountSettings,
} from "@features/dashboard"
import { NotFoundView } from "@src/routes"
import { TotpSetupView } from "@features/totp"
import { MfaAuthView, TotpLogin } from "@features/mfa"

const AppRouter = () => {
  const { isInitialized, isLoading } = useAuthContext()

  useTokenRefresh()

  if (!isInitialized) {
    return <>Not isInitialized...</>
  }
  if (isLoading) {
    return <>Loading...</>
  }
  return (
    <Routes>
      <Route path="/" element={<ForwardRoute />}></Route>
      <Route path="/oauth/callback" element={<ForwardRoute />} />
      <Route element={<GuestOnlyRoute />}>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
      </Route>
      <Route element={<ProtectedRoute scope={["mfa:verify"]} />}>
        <Route path="/session/mfa" element={<MfaAuthView />}>
          <Route path="totp" element={<TotpLogin />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute scope={["admin:access"]} />}>
        <Route path="/dashboard" element={<DashboardView />}>
          <Route
            index={true}
            element={<Navigate to="/dashboard/security" replace />}
          />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="activity" element={<ActivitySettings />} />
          <Route path="preferences" element={<PreferenceSettings />} />
          <Route path="account" element={<AccountSettings />} />
        </Route>
        <Route path="totp/setup" element={<TotpSetupView />} />
      </Route>
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  )
}
export default AppRouter
