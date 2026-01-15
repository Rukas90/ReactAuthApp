import { JWTPayload, SignJWT, jwtVerify } from "jose"
import { JOSEError } from "jose/errors"
import { UnexpectedError } from "@shared/errors"
import { User } from "@prisma/client"
import { AuthLevel, Result } from "@project/shared"

const ENCODER = new TextEncoder()
const SECRET = ENCODER.encode(process.env.JWT_SECRET!)

export type Scope = "2fa:verify" | "user:access"

export type AccessTokenClaims = {
  auth_level: AuthLevel
  email_verified: boolean
  scope: Scope[]
}

export interface AccessTokenPayload extends JWTPayload, AccessTokenClaims {}

export const generatePre2faAccessToken = (user: User) => {
  return generateAccessToken(
    user,
    {
      auth_level: "pre_2fa",
      email_verified: user.is_verified,
      scope: ["2fa:verify"],
    },
    "5m"
  )
}
export const generateFullAccessToken = (user: User) => {
  return generateAccessToken(
    user,
    {
      auth_level: "full",
      email_verified: user.is_verified,
      scope: ["user:access"],
    },
    "15m"
  )
}
const generateAccessToken = (
  user: User,
  claims: AccessTokenClaims,
  expiration: number | string | Date
): Promise<string> => {
  return new SignJWT(claims)
    .setIssuer(process.env.API_URL!)
    .setAudience(process.env.CLIENT_URL!)
    .setSubject(user.id)
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
