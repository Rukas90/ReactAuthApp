import { getDefaultRedirect } from "@auth/config"
import { useAuthContext } from "@auth/hooks"
import { Navigate } from "react-router-dom"

const ForwardRoute = () => {
  const { user } = useAuthContext()
  const redirect = getDefaultRedirect(user)

  return <Navigate to={redirect} replace />
}
export default ForwardRoute
