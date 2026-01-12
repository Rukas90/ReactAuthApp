import { useLogout } from "@src/features/auth"
import CustomButton from "./CustomButton"

const LogoutButton = () => {
  const logout = useLogout()

  const handleLogout = async () => {
    await logout()
  }

  return <CustomButton text="Logout" action={handleLogout} />
}
export default LogoutButton
