import { VoidResult } from "#lib/Result"
import { RegisterSchema, type RegisterData } from "#auth/db/RegisterSchema"
import type z from "zod"
import useAuthForm from "./useAuthForm"
import { useRegister } from "../contexts/AuthContext"

const useRegisterForm = () => {
  const register = useRegister()

  const handleRegister = async (
    data: RegisterData
  ): Promise<VoidResult<string>> => {
    const result = await register(data)
    if (!result.ok) {
      return VoidResult.error(result.error.detail)
    }
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

  const form = useAuthForm({
    schema: RegisterSchema,
    onAuth: handleRegister,
    getValidationError,
  })

  return {
    ...form,
  }
}
export default useRegisterForm
