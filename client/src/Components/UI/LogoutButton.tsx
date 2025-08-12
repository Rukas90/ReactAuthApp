import React from "react"
import CustomButton from "../Buttons/CustomButton"
import { Logout } from "Utils/Auth"
import { useNavigate } from "react-router-dom"
import { useBusyContext } from "Contexts/BusyProvider"
import { useDialog } from "Contexts/DialogContext"

interface Props {
  extendWidth?: boolean
}
const LogoutButton = ({ extendWidth = false }: Props) => {
  const navigate = useNavigate()
  const { isBusy } = useBusyContext()
  const { showDialog } = useDialog()

  const handleLogout = async () => {
    const response = await Logout()
    console.log("logged out response" + response)
    if (response.success) {
      navigate(response.data.redirect)
    }
  }
  return (
    <div className={extendWidth ? "w-100" : ""}>
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
        extendWidth={extendWidth}
        disabled={isBusy()}
      />
    </div>
  )
}
export default LogoutButton
