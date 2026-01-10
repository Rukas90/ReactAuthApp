import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"

interface Props extends React.ComponentProps<"div"> {}

export const ProtectedRoute = ({ children }: Props) => {
  const { user } = useAuthContext()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children ? <>{children}</> : <Outlet />
}
