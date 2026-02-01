import { config } from "@base/app"

export const createVerificationLink = (token: string): string => {
  const url = new URL("/v1/verify/token", config().origin.api)
  url.searchParams.set("token", token)

  return url.toString()
}
