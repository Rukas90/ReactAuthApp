import React from "react"
import {
  HasLowercase,
  HasUppercase,
  HasNumber,
  HasSpecialCharacter,
} from "Utils/Utilities"
import ValidationGroup from "Components/ValidationGroup"

interface Props {
  password: string // The password to be validated
  minLength?: number // Optional minimum length requirement for the password
  onValidationStatusChange?: (status: boolean) => void // Callback for password validation status
}

/**
 * PasswordValidationGroup Component
 * Renders a group of validation conditions for password strength and requirements.
 * It checks for lowercase, uppercase, numeric, and special characters, as well as minimum length.
 *
 * Props:
 * - password: The password string to validate.
 * - minLength: The minimum length the password should be. Default is 12.
 * - onValidationStatusChange: Callback function that receives the overall validation status.
 */
const PasswordValidationGroup = ({
  password,
  minLength = 12,
  onValidationStatusChange,
}: Props) => {
  return (
    <>
      <ValidationGroup<string>
        value={password}
        conditions={[
          {
            evaluateFunc: HasLowercase,
            conditionText: Translate("PASSWORD_LOWERCASE_CONDITION"),
          },
          {
            evaluateFunc: HasUppercase,
            conditionText: Translate("PASSWORD_UPPERCASE_CONDITION"),
          },
          {
            evaluateFunc: HasNumber,
            conditionText: Translate("PASSWORD_NUMBER_CONDITION"),
          },
          {
            evaluateFunc: HasSpecialCharacter,
            conditionText: Translate("PASSWORD_SPECIAL_CHARACTER_CONDITION"),
          },
          {
            evaluateFunc: (password) => password.length >= minLength,
            conditionText: Translate("PASSWORD_MINIMUM_CHARACTER_CONDITION", {
              count: minLength,
            }),
          },
        ]}
        onValidationStatusChange={onValidationStatusChange}
      />
    </>
  )
}
export default PasswordValidationGroup
