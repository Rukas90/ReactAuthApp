import useAuthContext from "@auth/hooks/useAuthContext"
import { Navigate, Outlet } from "react-router-dom"

interface Props extends Pick<React.ComponentProps<"div">, "children"> {
  redirectTo?: string
}
const GuestOnlyRoute = ({ redirectTo = "/", children }: Props) => {
  const { user } = useAuthContext()

  if (user) {
    return <Navigate to={redirectTo} replace />
  }
  return children ? <>{children}</> : <Outlet />
}
export default GuestOnlyRoute
