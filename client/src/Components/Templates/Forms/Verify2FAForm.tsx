import React, { useState } from "react"
import FormHeader from "Templates/FormHeader"
import Spacer from "Components/UI/Spacer"
import CustomButton from "Components/Buttons/CustomButton"
import DigitField from "Components/UI/DigitField"
import { Auth2FACode } from "Utils/Auth"
import { useNavigate } from "react-router-dom"
import { MessageType, broadcast } from "Contexts/MessageContext"

const Verify2FAForm = () => {
  const [code, setCode] = useState("")

  const navigate = useNavigate()
  const { broadcastMessage } = broadcast()

  const authenticateCode = async () => {
    const response = await Auth2FACode(code)

    if (!response.success) {
      broadcastMessage(response.error, MessageType.Error)
      return
    }
    navigate("/")
  }
  return (
    <div>
      <FormHeader
        header={Translate("2F_AUTH")}
        secondary={Translate("ENTER_2FA_CODE_SUMMARY")}
        linkHref="#"
      />
      <div className="form-container w-100 mt-4 d-flex justify-content-center">
        <div className="w-100 d-flex justify-content-center align-items-center vstack">
          <DigitField onCodeChanged={setCode} />
          <Spacer space={1.5} unit="rem" isVertical />
          <CustomButton
            text={Translate("CONTINUE")}
            icon=""
            action={authenticateCode}
            extendWidth
          />
          <Spacer space={1.5} unit="rem" isVertical />
        </div>
      </div>
    </div>
  )
}

export default Verify2FAForm
