import React, { useRef } from "react"
import FormHeader from "Templates/FormHeader"
import Spacer from "Components/UI/Spacer"
import CustomButton from "Components/Buttons/CustomButton"
import InputField from "Components/UI/InputField"
import { IdentifyAccount } from "Utils/Auth"
import { MessageType, broadcast } from "Contexts/MessageContext"
import { BuildApiUrl } from "Utils/Requests"

const OAuthIdentificationForm = () => {
  const emailRef = useRef<HTMLInputElement>(null)

  const { broadcastMessage } = broadcast()

  const identifyAccount = async () => {
    if (!emailRef.current) {
      return
    }
    const response = await IdentifyAccount(emailRef.current.value)

    if (!response.success) {
      broadcastMessage(response.error, MessageType.Error)
      return
    }
    if (!response.success) {
      return
    }
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
            ref={emailRef}
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
