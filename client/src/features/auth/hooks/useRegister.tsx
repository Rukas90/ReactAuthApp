import { VoidResult } from "#lib/Result"
import { RegisterSchema, type RegisterData } from "#auth/db/RegisterSchema"
import type z from "zod"
import useAuthForm from "./useAuthForm"

const useRegister = () => {
  const handleLogin = async (
    data: RegisterData,
    captchaToken: string
  ): Promise<VoidResult<string>> => {
    console.log(data)
    return VoidResult.ok()
  }
  const getValidationError = (
    form: FormData,
    validationError: z.ZodSafeParseError<RegisterData>
  ): string => {
    if (!form.get("email") && !form.get("password")) {
      return "Please enter a valid email and password."
    }
    return validationError.error.issues[0].message
  }
  const auth = useAuthForm({
    schema: RegisterSchema,
    onAuth: handleLogin,
    getValidationError,
  })
  return {
    ...auth,
  }
}
export default useRegister
