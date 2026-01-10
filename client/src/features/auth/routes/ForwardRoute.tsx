import { Navigate } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"
import { getDefaultRedirect } from "../config/AuthRedirect"

export const ForwardRoute = () => {
  const { user } = useAuthContext()
  const redirect = getDefaultRedirect(user)

  return <Navigate to={redirect} replace />
}
