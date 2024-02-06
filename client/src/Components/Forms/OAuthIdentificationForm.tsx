import React, { useState } from "react"
import FormHeader from "Templates/FormHeader"
import Spacer from "Components/Spacer"
import CustomButton from "Components/Buttons/CustomButton"
import InputField from "Components/InputField"
import { IdentifyAccount } from "Utils/Auth"
import { useCsrfToken } from "Contexts/CsrfContext"
import { MessageType, broadcast } from "Contexts/MessageContext"
import { BuildApiUrl } from "Utils/Requests"

const OAuthIdentificationForm = () => {
  const [email, setEmail] = useState("")

  const { broadcastMessage } = broadcast()

  const { fetchCsrfToken } = useCsrfToken()

  const identifyAccount = async () => {
    const response = await IdentifyAccount(email, await fetchCsrfToken(true))

    if (!response.success && response.error) {
      broadcastMessage(response.error, MessageType.Error)
      return
    }
    await fetchCsrfToken(true) // Refresh the csrf token

    const authRedirect = response.data.authRedirect

    if (!authRedirect) {
      return
    }
    window.location.href = BuildApiUrl(`/auth/${authRedirect}`)
  }
  return (
    <div>
      <FormHeader
        header={Translate("IDENTIFY_ACCOUNT")}
        secondary={Translate("IDENTIFY_YOUR_ACCOUNT")}
      />
      <div className="form-container w-100 mt-4 d-flex justify-content-center">
        <div className="w-100 d-flex justify-content-center align-items-center vstack">
          <InputField
            type="email"
            placeholder={Translate("EMAIL")}
            onValueChange={setEmail}
            extendWidth
          />
          <Spacer space={1.5} unit="rem" isVertical />
          <CustomButton
            text={Translate("CONTINUE")}
            icon=""
            action={identifyAccount}
            extendWidth
          />
          <Spacer space={1.5} unit="rem" isVertical />
        </div>
      </div>
    </div>
  )
}

export default OAuthIdentificationForm
