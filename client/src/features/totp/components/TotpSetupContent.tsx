import {
  CancelButton,
  CodeField,
  ErrorBox,
  SubmitButton,
} from "@features/shared"
import TotpHelpInfo from "./TotpHelpInfo"
import TotpSetupData from "./TotpSetupData"
import { useState } from "react"
import useTotpSetup from "../hooks/useTotpSetup"
import { useNavigate } from "react-router-dom"

const TotpSetupContent = () => {
  const { data, verifyCode, cancelSetup, error, requiredCodeLength } =
    useTotpSetup()
  const [code, setCode] = useState("")
  const navigate = useNavigate()

  return (
    <>
      <TotpSetupData data={data} />
      <CodeField
        digits={requiredCodeLength}
        placeholder="-"
        onCodeChanged={setCode}
      />
      <TotpHelpInfo />
      <div className="w-full h-px bg-stone-800 my-2" />
      <div className="flex gap-4 items-center mb-2">
        <CancelButton
          text="Cancel"
          action={() => {
            cancelSetup().finally(() => navigate("/dashboard/security"))
          }}
        />
        <SubmitButton
          text="Submit"
          action={() => verifyCode(code)}
          disabled={code.length !== requiredCodeLength}
        />
      </div>
      <ErrorBox isHidden={!error}>{error}</ErrorBox>
    </>
  )
}
export default TotpSetupContent
