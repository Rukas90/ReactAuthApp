import { Route, Routes } from "react-router-dom"
import {
  LoginView,
  RegisterView,
  ProtectedRoute,
  GuestOnlyRoute,
  ForwardRoute,
} from "@auth/routes"
import { useAuthContext } from "@auth/hooks"
import { DashboardView } from "@dashboard/routes"
import { NotFoundView } from "@src/routes"

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
