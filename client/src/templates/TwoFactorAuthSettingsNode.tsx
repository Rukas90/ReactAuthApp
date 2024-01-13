import React, { useState } from "react"
import Spacer from "./Spacer"
import InputField from "../components/InputField"
import CustomButton from "../components/CustomButton"
import ErrorMessage from "../components/ErrorMessage"
import { useBusyContext } from "../contexts/BusyProvider"

interface Props {
  qrSrc: string // URL of the QR code image for 2FA setup
  setupKey: string // Setup key string for manual entry in the authentication app
  error: string // Error message to display, if any
  onVerify: (code: string) => void // Function to call when the verification code is submitted
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
 * - error: Error message to be displayed in case of a verification failure.
 * - onVerify: Callback function to be called with the verification code.
 */
const TwoFactorAuthSettingsNode = ({
  qrSrc,
  setupKey,
  error,
  onVerify,
}: Props) => {
  const [code, setCode] = useState("") // Local state to store the user-entered verification code
  const { isBusy } = useBusyContext() // Context hook to determine if the app is in a busy state
  const isLoading = isBusy() // Flag indicating whether the app is currently processing something

  // Function to handle verification action
  const verify = async () => onVerify(code)

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
          className={`d-flex gap-4 flex-md-row flex-column align-items-md-start align-items-center`}
        >
          <img src={qrSrc} className="qr-code max-w-100" />
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
          />
          <CustomButton
            text="Verify"
            style="dark"
            disabled={isLoading}
            action={verify}
          />
        </div>
        {error && (
          <>
            <Spacer space={1.0} unit="rem" isVertical />
            <ErrorMessage content={error} />
          </>
        )}
      </div>
    </>
  )
}
export default TwoFactorAuthSettingsNode
