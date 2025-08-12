import React, { useState } from "react"
import FormHeader from "Templates/FormHeader"
import Spacer from "Components/UI/Spacer"
import CustomButton from "Components/Buttons/CustomButton"
import InputField from "Components/UI/InputField"
import { VerificationTemplate } from "Utils/Verifications"
import { useVerification } from "Hooks/useVerification"

const VerifyAccountVerificationTemplate: VerificationTemplate = {
  settings: {
    type: "VERIFY_ACCOUNT",
    dispatch: {
      command: "VERIFY_ACCOUNT",
      payload: {},
    },
  },
  email: {
    title: "Activate your account",
  },
}
const VerifyForm = () => {
  const [code, setCode] = useState("")
  const { loading, verifying, verify } = useVerification(
    VerifyAccountVerificationTemplate,
    true
  )

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
            action={async () => {
              const response = await verify(code)
              console.log(response)
            }}
            extendWidth
            disabled={loading || verifying}
          />
          <Spacer space={1.5} unit="rem" isVertical />
        </div>
      </div>
    </div>
  )
}

export default VerifyForm
