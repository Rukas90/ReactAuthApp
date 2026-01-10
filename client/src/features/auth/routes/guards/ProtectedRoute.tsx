import useAuthContext from "@auth/hooks/useAuthContext"
import { Navigate, Outlet, useLocation } from "react-router-dom"

interface Props extends Pick<React.ComponentProps<"div">, "children"> {}

const ProtectedRoute = ({ children }: Props) => {
  const { user } = useAuthContext()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children ? <>{children}</> : <Outlet />
}
export default ProtectedRoute
