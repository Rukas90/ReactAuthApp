import { JWTPayload, SignJWT, jwtVerify } from "jose"
import { Result } from "@shared/types"
import { JOSEError } from "jose/errors"
import { UnexpectedError } from "@shared/errors"

const ENCODER = new TextEncoder()
const SECRET = ENCODER.encode(process.env.JWT_SECRET!)

export interface AccessTokenPayload extends JWTPayload, AccessTokenData {}

export type AccessTokenData = {
  verifiedEmail: boolean
  otpPending: boolean
}

export const generateAccessToken = (
  userId: string,
  data: AccessTokenData
): Promise<string> => {
  const expiration = data.otpPending ? "5m" : "15m"

  return new SignJWT(data)
    .setIssuer(process.env.API_URL!)
    .setAudience(process.env.CLIENT_URL!)
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(expiration)
    .setProtectedHeader({ alg: "HS256" })
    .sign(SECRET)
}

export const validateAccessToken = async (
  token: string
): Promise<Result<AccessTokenPayload, Error>> => {
  try {
    const result = await jwtVerify<AccessTokenPayload>(token, SECRET, {
      issuer: process.env.API_URL!,
      audience: process.env.CLIENT_URL!,
    })
    return Result.success(result.payload)
  } catch (error) {
    if (error instanceof JOSEError) {
      return Result.error(error)
    }
    return Result.error(
      new UnexpectedError(
        "Unexpected error when verifying access token.",
        "UNEXPECTED_ERROR"
      )
    )
  }
}
