import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthContext } from "../../hooks"
import type { Scope, ScopeRequirement } from "@project/shared"

interface Props extends Pick<React.ComponentProps<"div">, "children"> {
  scope: Scope[]
  redirect?: string
  requirement?: ScopeRequirement
}
const ProtectedRoute = ({
  scope,
  redirect = "/login",
  requirement = "all",
  children,
}: Props) => {
  const { user } = useAuthContext()
  const location = useLocation()

  if (!user) {
    return <Navigate to={redirect} state={{ from: location }} replace />
  }
  const hasAccess =
    requirement === "all"
      ? scope.every((s) => user.scope.includes(s))
      : scope.some((s) => user.scope.includes(s))

  if (!hasAccess) {
    return <Navigate to={redirect} state={{ from: location }} replace />
  }
  return children ? <>{children}</> : <Outlet />
}
export default ProtectedRoute
