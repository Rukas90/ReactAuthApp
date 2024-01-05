import React, { useState } from "react"
import FormHeader from "../templates/FormHeader"
import Spacer from "../templates/Spacer"
import CustomButton from "./CustomButton"
import { useTranslation } from "react-i18next"
import InputField from "./InputField"
import { Verify } from "../utils/Auth"
import { useNavigate } from "react-router-dom"

const VerifyForm = () => {
  const [code, setCode] = useState("")

  const { t } = useTranslation()
  const navigate = useNavigate()

  const verifyAccount = async () => {
    const response = await Verify(code)

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
          />
          <Spacer space={1.5} unit="rem" isVertical />
          <CustomButton
            text={t("CONTINUE")}
            icon=""
            action={verifyAccount}
            extendWidth
          />
        </div>
      </div>
    </div>
  )
}

export default VerifyForm
