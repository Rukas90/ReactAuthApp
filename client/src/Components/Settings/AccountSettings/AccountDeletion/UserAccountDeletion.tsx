import CustomButton from "Components/Buttons/CustomButton"
import LabelHorizontalSeparator from "Components/Templates/LabelHorizontalSeparator"
import { TextSizeOption } from "Utils/Types/TextSizeOption"
import { HorizontalAlignment } from "Utils/Types/HorizontalAlignment"
import React from "react"
import { useDialog } from "Contexts/DialogContext"
import withNotifications, {
  WithNotificationsProps,
} from "Contexts/NotificationsContexts"
import { DeleteAccount } from "Utils/Account"
import { useCsrfToken } from "Contexts/CsrfContext"
import { useNavigate } from "react-router-dom"

const UserAccountDeletion = ({ notifications }: WithNotificationsProps) => {
  const { showDialog } = useDialog()
  const { fetchCsrfToken } = useCsrfToken()

  const navigate = useNavigate()

  const displayDialog = () => {
    showDialog({
      title: "Delete Account",
      body: (
        <>
          <p>Are you sure want to delete your account?</p>
          <p>
            If so, please type <strong>'DELETE'</strong> and press the confirm
            button.
          </p>
        </>
      ),
      requiresInputField: true,
      onBeforeConfirm: (input?: string): boolean => {
        if (input && input === "DELETE") {
          return true
        }
        notifications.error("Please enter the required validation token.")
        return false
      },
      onConfirmCallback: deleteAccount,
    })
  }
  const deleteAccount = async () => {
    const response = await DeleteAccount(await fetchCsrfToken())

    if (!response.success && response.error) {
      return notifications.error(response.error)
    }
    await fetchCsrfToken(true)

    navigate("/login")
  }

  return (
    <>
      <LabelHorizontalSeparator
        label="Danger Zone"
        alignment={HorizontalAlignment.Start}
        textSize={TextSizeOption.Regular}
        textColor="danger"
        borderColor="danger"
      />
      <div className="border border-danger border-top-0 p-4">
        <CustomButton
          style="danger"
          text="Delete Account"
          action={displayDialog}
        />
      </div>
    </>
  )
}
export default withNotifications(UserAccountDeletion)
