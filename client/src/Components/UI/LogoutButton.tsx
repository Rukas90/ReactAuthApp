import React from "react"
import CustomButton from "../Buttons/CustomButton"
import { Logout } from "Utils/Auth"
import { useNavigate } from "react-router-dom"
import { useBusyContext } from "Contexts/BusyProvider"
import { useCsrfToken } from "Contexts/CsrfContext"
import { useDialog } from "Contexts/DialogContext"

const LogoutButton = () => {
  const navigate = useNavigate()
  const { isBusy } = useBusyContext()
  const { fetchCsrfToken } = useCsrfToken()
  const { showDialog } = useDialog()

  const handleLogout = async () => {
    const response = await Logout(await fetchCsrfToken())

    if (response.success) {
      await fetchCsrfToken(true) // Refresh the token from the server

      navigate("/login")
    }
  }
  return (
    <div>
      <CustomButton
        text={Translate("LOG_OUT")}
        icon=""
        action={() => {
          showDialog({
            title: Localized("LOGOUT_DIALOG_TITLE"),
            message: Localized("LOGOUT_DIALOG_MESSAGE"),
            onConfirmCallback: handleLogout,
          })
        }}
        extendWidth={false}
        disabled={isBusy()}
      />
    </div>
  )
}
export default LogoutButton
