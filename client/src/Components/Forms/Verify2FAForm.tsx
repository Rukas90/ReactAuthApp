import React, { useState } from "react"
import FormHeader from "Templates/FormHeader"
import Spacer from "Components/Spacer"
import CustomButton from "Components/Buttons/CustomButton"
import DigitField from "Components/DigitField"
import { Auth2FACode } from "Utils/Auth"
import { useNavigate } from "react-router-dom"
import { useCsrfToken } from "Contexts/CsrfContext"
import { MessageType, broadcast } from "Contexts/MessageContext"

const Verify2FAForm = () => {
  const [code, setCode] = useState("")

  const navigate = useNavigate()
  const { broadcastMessage } = broadcast()

  const { fetchCsrfToken } = useCsrfToken()

  const authenticateCode = async () => {
    const csrfToken = await fetchCsrfToken()
    const response = await Auth2FACode(code, csrfToken)

    if (!response.success) {
      broadcastMessage("Invalid Code", MessageType.Error)
      return
    }
    await fetchCsrfToken(true) // Refresh the csrf token

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
