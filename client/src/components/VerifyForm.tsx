import React, { useState } from "react"
import FormHeader from "./Templates/FormHeader"
import Spacer from "./Templates/Spacer"
import CustomButton from "./Buttons/CustomButton"
import { useTranslation } from "react-i18next"
import InputField from "./InputField"
import { Verify } from "../utils/Auth"
import { useNavigate } from "react-router-dom"
import { useCsrfToken } from "../contexts/CsrfContext"

const VerifyForm = () => {
  const [code, setCode] = useState("")

  const { t } = useTranslation()
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
        header={t("VERIFY_ACCOUNT")}
        secondary={t("VERIFY_YOUR_ACCOUNT")}
        linkText={t("RESEND_CODE")}
        linkHref="#"
      />
      <div className="form-container w-100 mt-4 d-flex justify-content-center">
        <div className="w-100 d-flex justify-content-center align-items-center vstack">
          <InputField
            type="number"
            placeholder={t("VERIFICATION_CODE")}
            onValueChange={setCode}
            extendWidth
          />
          <Spacer space={1.5} unit="rem" isVertical />
          <CustomButton
            text={t("CONTINUE")}
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
