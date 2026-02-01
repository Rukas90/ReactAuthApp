import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import type z from "zod"
import type { ApiResult } from "@src/lib"

interface Props<TSchema extends z.ZodType> {
  schema: TSchema
  requestFn: (data: z.infer<TSchema>) => Promise<ApiResult<string>>
  onSuccess?: () => void
}
export const usePasswordForm = <TSchema extends z.ZodType>({
  schema,
  requestFn,
  onSuccess,
}: Props<TSchema>) => {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    try {
      const validation = await schema.safeParseAsync(data)

      if (!validation.success) {
        const errors: Record<string, string> = {}
        validation.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0].toString()] = issue.message
          }
        })
        setError(validation.error.issues[0].message)
        setFieldErrors(errors)
        return
      }
      setFieldErrors({})
      const response = await requestFn(validation.data)

      if (!response.ok) {
        setError(response.error.detail)
      } else {
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] })
        setError(null)
        onSuccess?.()
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  return {
    handleSubmit,
    isSubmitting,
    error,
    fieldErrors,
  }
}
