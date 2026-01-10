import { Navigate, Outlet } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"

interface Props extends React.ComponentProps<"div"> {
  redirectTo?: string
}
export const GuestOnlyRoute = ({ redirectTo = "/", children }: Props) => {
  const { user } = useAuthContext()

  if (user) {
    return <Navigate to={redirectTo} replace />
  }
  return children ? <>{children}</> : <Outlet />
}
