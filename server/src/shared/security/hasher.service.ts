import crypto from "crypto"
import argon2 from "argon2"

export const hashing = {
  argon2: {
    hash: async (value: string): Promise<string> => {
      return await argon2.hash(value)
    },
    compare: async (input: string, hashed: string): Promise<boolean> => {
      return await argon2.verify(hashed, input)
    },
  },
  hmac: {
    hash: async (value: string, secret: string): Promise<string> => {
      return crypto.createHmac("sha256", secret).update(value).digest("hex")
    },
  },
}
