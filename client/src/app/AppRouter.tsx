import { Route, Routes } from "react-router-dom"
import LoginView from "#features/auth/routes/LoginView"
import RegisterView from "#features/auth/routes/RegisterView"
import DashboardView from "#features/dashboard/routes/DashboardView"

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/dashboard" element={<DashboardView />} />
    </Routes>
  )
}
export default AppRouter
