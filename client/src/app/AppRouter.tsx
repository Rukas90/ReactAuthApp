import { Route, Routes } from "react-router-dom"
import LoginView from "#features/auth/routes/LoginView"
import RegisterView from "#features/auth/routes/RegisterView"
import DashboardView from "#features/dashboard/routes/DashboardView"
import { ProtectedRoute } from "#features/auth/routes/ProtectedRoute"
import { GuestOnlyRoute } from "#features/auth/routes/GuestOnlyRoute"
import { useAuthContext } from "#features/auth/contexts/AuthContext"
import { ForwardRoute } from "#features/auth/routes/ForwardRoute"
import NotFoundView from "#features/404/routes/NotFoundView"

const AppRouter = () => {
  const { isInitialized, isLoading } = useAuthContext()

  if (!isInitialized || isLoading) {
    return <>Loading...</>
  }
  return (
    <Routes>
      <Route path="/" element={<ForwardRoute />}></Route>
      <Route element={<GuestOnlyRoute />}>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardView />} />
      </Route>
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  )
}
export default AppRouter
