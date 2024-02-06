import React, { useState } from "react"
import FormHeader from "Templates/FormHeader"
import Spacer from "Components/Spacer"
import CustomButton from "Components/Buttons/CustomButton"
import InputField from "Components/InputField"
import { Verify } from "Utils/Auth"
import { useNavigate } from "react-router-dom"
import { useCsrfToken } from "Contexts/CsrfContext"

const VerifyForm = () => {
  const [code, setCode] = useState("")

  const navigate = useNavigate()

  const { fetchCsrfToken } = useCsrfToken()

  const verifyAccount = async () => {
    const response = await Verify(code, await fetchCsrfToken())

    if (response.success) {
      navigate("/")
    }
  }
  return (
    <div>
      <FormHeader
        header={Translate("VERIFY_ACCOUNT")}
        secondary={Translate("VERIFY_YOUR_ACCOUNT")}
        linkText={Translate("RESEND_CODE")}
        linkHref="#"
      />
      <div className="form-container w-100 mt-4 d-flex justify-content-center">
        <div className="w-100 d-flex justify-content-center align-items-center vstack">
          <InputField
            type="number"
            placeholder={Translate("VERIFICATION_CODE")}
            onValueChange={setCode}
            extendWidth
          />
          <Spacer space={1.5} unit="rem" isVertical />
          <CustomButton
            text={Translate("CONTINUE")}
            icon=""
            action={verifyAccount}
            extendWidth
          />
          <Spacer space={1.5} unit="rem" isVertical />
        </div>
      </div>
    </div>
  )
}

export default VerifyForm
