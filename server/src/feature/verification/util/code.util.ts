import crypto from "crypto"
import { nanoid } from "nanoid"

export const generateReadableCode = (length: number): string => {
  const chars = "346789ACDEFGHJKLMNPQRTUVWXY"
  let code = ""

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length)
    code += chars[randomIndex]
  }
  return code
}
export const generateTokenCode = (length: number): string => {
  return nanoid(length)
}
