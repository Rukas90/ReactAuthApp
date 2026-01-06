import { Route, Routes } from "react-router-dom"
import LoginView from "#views/auth/LoginView"
import RegisterView from "#views/auth/RegisterView"
import DashboardView from "#views/dashboard/DashboardView"

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
