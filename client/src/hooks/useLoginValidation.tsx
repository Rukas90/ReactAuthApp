import { VoidResult } from "#lib/Result"
import { LoginSchema } from "#schemas/LoginSchema"
import { useState } from "react"

const useLoginValidation = () => {
  const [fieldErrors, setFieldErrors] = useState<Set<string>>(new Set<string>())

  const validate = async (
    form: FormData,
    hCaptchaToken: string | null
  ): Promise<VoidResult<string>> => {
    const formValidation = validateForm(form)

    if (!formValidation.ok) {
      return formValidation
    }
    const entries = Object.fromEntries(form)
    const result = await LoginSchema.safeParseAsync(entries)

    if (!result.success) {
      return VoidResult.error(result.error.issues[0].message)
    }
    if (!hCaptchaToken) {
      return VoidResult.error("Please complete the Captcha.")
    }
    return VoidResult.ok()
  }
  const validateForm = (form: FormData): VoidResult<string> => {
    const newFieldErrors = new Set<string>()
    try {
      if (!form.get("email")) {
        newFieldErrors.add("email")
      }
      if (!form.get("password")) {
        newFieldErrors.add("password")
      }
      if (newFieldErrors.size > 0) {
        return VoidResult.error("Invalid email or password.")
      }
      return VoidResult.ok()
    } finally {
      setFieldErrors(newFieldErrors)
    }
  }
  return {
    validate,
    fieldErrors,
  }
}
export default useLoginValidation
