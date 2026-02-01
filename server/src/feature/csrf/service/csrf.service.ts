import crypto from "crypto"

const CSRF_SECRET = process.env.CSRF_SECRET!

const csrfService = {
  generateCsrfToken: () => {
    const token = crypto.randomBytes(32).toString("hex")
    const signature = crypto
      .createHmac("sha256", CSRF_SECRET)
      .update(token)
      .digest("hex")
    return `${token}.${signature}`
  },
  verifyCsrfToken: (token: string): boolean => {
    const [value, signature] = token.split(".")

    if (!value || !signature) {
      return false
    }
    const expectedSignature = crypto
      .createHmac("sha256", CSRF_SECRET)
      .update(value)
      .digest("hex")

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    )
  },
}
export default csrfService
