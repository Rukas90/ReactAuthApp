import React from "react"
import {
  HasLowercase,
  HasUppercase,
  HasNumber,
  HasSpecialCharacter,
} from "../utils/Utilities"
import ValidationGroup from "../components/ValidationGroup"
import { useTranslation } from "react-i18next"

interface Props {
  password: string
  minLength?: number
  onValidationStatusChange?: (status: boolean) => void
}

const PasswordValidationGroup = ({
  password,
  minLength = 12,
  onValidationStatusChange,
}: Props) => {
  const { t } = useTranslation()

  return (
    <>
      <ValidationGroup<string>
        value={password}
        conditions={[
          {
            evaluateFunc: HasLowercase,
            conditionText: t("PASSWORD_LOWERCASE_CONDITION"),
          },
          {
            evaluateFunc: HasUppercase,
            conditionText: t("PASSWORD_UPPERCASE_CONDITION"),
          },
          {
            evaluateFunc: HasNumber,
            conditionText: t("PASSWORD_NUMBER_CONDITION"),
          },
          {
            evaluateFunc: HasSpecialCharacter,
            conditionText: t("PASSWORD_SPECIAL_CHARACTER_CONDITION"),
          },
          {
            evaluateFunc: (password) => password.length >= minLength,
            conditionText: t("PASSWORD_MINIMUM_CHARACTER_CONDITION", {
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
