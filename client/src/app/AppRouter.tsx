import { Navigate, Route, Routes } from "react-router-dom"
import {
  LoginView,
  RegisterView,
  ProtectedRoute,
  GuestOnlyRoute,
  ForwardRoute,
  useAuthContext,
} from "@features/auth"
import {
  DashboardView,
  TOTPSetupView,
  SecuritySettings,
  ActivitySettings,
  PreferenceSettings,
  AccountSettings,
} from "@features/dashboard"
import { NotFoundView } from "@src/routes"

const AppRouter = () => {
  const { isInitialized, isLoading } = useAuthContext()

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
      <Route element={<ProtectedRoute />}>
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
        <Route path="totp/setup" element={<TOTPSetupView />} />
      </Route>
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  )
}
export default AppRouter
