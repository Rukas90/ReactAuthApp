import React, { useState } from "react"
import Spacer from "Components/UI/Spacer"
import InputField from "Components/UI/InputField"
import CustomButton from "Components/Buttons/CustomButton"
import { useBusyContext } from "Contexts/BusyProvider"

interface Props {
  qrSrc: string // URL of the QR code image for 2FA setup
  setupKey: string // Setup key string for manual entry in the authentication app
  onVerify: (code: string) => Promise<boolean> // Function to call when the verification code is submitted
}

/**
 * TwoFactorAuthSettingsNode Component
 * Renders the interface for setting up and verifying two-factor authentication (2FA).
 * This includes displaying a QR code for scanning, a setup key for manual entry,
 * and an input field for entering the verification code from the user's authentication app.
 *
 * Props:
 * - qrSrc: Source URL for the QR code image.
 * - setupKey: Key string for manual entry in the authentication app.
 * - onVerify: Callback function to be called with the verification code.
 */
const TwoFactorAuthSettingsNode = ({ qrSrc, setupKey, onVerify }: Props) => {
  const [code, setCode] = useState("") // Local state to store the user-entered verification code
  const { isBusy } = useBusyContext() // Context hook to determine if the app is in a busy state
  const isLoading = isBusy() // Flag indicating whether the app is currently processing something
  const [indicateField, setIndicateField] = useState(false) // Flag that determines if the verification field should be error indicated

  // Function to handle verification action
  const verify = async () => setIndicateField(!(await onVerify(code)))

  return (
    <>
      <div className="text-secondary fw-normal p-2 d-flex flex-col">
        <span className="fs-5 fw-medium">1. Connect to authentication app</span>
        <Spacer space={0.5} unit="rem" isVertical />
        <span>
          Tap the '+' button in your authenticator app, then use the app to scan
          the below QR code or enter the provided setup key.
        </span>
        <Spacer space={1.5} unit="rem" isVertical />
        <div
          className={`d-flex gap-4 flex-md-row flex-column align-items-md-end align-items-center`}
        >
          <img src={qrSrc} className="qr-code" />
          <InputField
            value={setupKey}
            placeholder="Setup Key"
            readonly={true}
            extendWidth
          />
        </div>
        <Spacer space={1.5} unit="rem" isVertical />
        <span className="fs-5 fw-medium">2. Verify the code from the app</span>
        <Spacer space={0.5} unit="rem" isVertical />
        <span>
          Enter the code from your authenticator app to the below field and
          press 'Verify'.
        </span>
        <Spacer space={1.5} unit="rem" isVertical />
        <div className="d-flex gap-4 flex-md-row flex-column">
          <InputField
            placeholder="Verification Code"
            type="number"
            readonly={isLoading}
            onValueChange={setCode}
            extendWidth
            indicateError={indicateField}
          />
          <CustomButton
            text="Verify"
            style="dark"
            disabled={isLoading}
            action={verify}
          />
        </div>
      </div>
    </>
  )
}
export default TwoFactorAuthSettingsNode
