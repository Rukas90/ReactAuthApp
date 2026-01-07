import { VoidResult } from "#lib/Result"
import { LoginSchema, type LoginData } from "#auth/db/LoginSchema"
import type z from "zod"
import useAuthForm from "./useAuthForm"
import { useAuthContext } from "#auth/contexts/AuthContext"

const useLogin = () => {
  const auth = useAuthContext()

  const handleLogin = async (data: LoginData): Promise<VoidResult<string>> => {
    const result = await auth.signIn(data)
    if (!result.ok) {
      return VoidResult.error(result.error.detail)
    }
    return VoidResult.ok()
  }
  const getValidationError = (
    form: FormData,
    validationError: z.ZodSafeParseError<LoginData>
  ): string => {
    if (!form.get("email") && !form.get("password")) {
      return "Please enter a valid email and password."
    }
    return validationError.error.issues[0].message
  }
  const form = useAuthForm({
    schema: LoginSchema,
    onAuth: handleLogin,
    getValidationError,
  })
  return {
    ...form,
  }
}
export default useLogin
