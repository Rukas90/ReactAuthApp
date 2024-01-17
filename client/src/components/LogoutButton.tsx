import React from "react"
import CustomButton from "./Buttons/CustomButton"
import { useTranslation } from "react-i18next"
import { Logout } from "../utils/Auth"
import { useNavigate } from "react-router-dom"
import { useBusyContext } from "../contexts/BusyProvider"
import { useCsrfToken } from "../contexts/CsrfContext"

const LogoutButton = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isBusy } = useBusyContext()
  const { fetchCsrfToken } = useCsrfToken()

  const handleLogout = async () => {
    const response = await Logout(await fetchCsrfToken())

    if (response.status === 200) {
      await fetchCsrfToken(true) // Refresh the token from the server

      navigate("/login")
    }
  }
  return (
    <div>
      <CustomButton
        text={t("LOG_OUT")}
        icon=""
        action={handleLogout}
        extendWidth={false}
        disabled={isBusy()}
      />
    </div>
  )
}
export default LogoutButton
