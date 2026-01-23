import { JWTPayload, SignJWT, jwtVerify } from "jose"
import { JOSEError } from "jose/errors"
import { UnexpectedError } from "@shared/errors"
import { User } from "@prisma/client"
import { AuthLevel, AuthUser, Result } from "@project/shared"
import ms from "ms"

const ENCODER = new TextEncoder()
const SECRET = ENCODER.encode(process.env.JWT_SECRET!)

export type Scope = "2fa:verify" | "user:access"

export type AccessTokenClaims = {
  auth_level: AuthLevel
  email_verified: boolean
  scope: Scope[]
}

export interface AccessTokenPayload extends JWTPayload, AccessTokenClaims {}

export const generatePre2faAccessToken = async (user: User) => {
  return await generateAccessToken(
    user,
    {
      auth_level: "pre_2fa",
      email_verified: user.is_verified,
      scope: ["2fa:verify"],
    },
    ms("5m"),
  )
}
export const generateFullAccessToken = async (user: User) => {
  return await generateAccessToken(
    user,
    {
      auth_level: "full",
      email_verified: user.is_verified,
      scope: ["user:access"],
    },
    ms("15m"),
  )
}
const generateAccessToken = async (
  user: User,
  claims: AccessTokenClaims,
  expirationMs: number,
): Promise<{ accessToken: string; authUser: AuthUser }> => {
  const expiresAtMs = Date.now() + expirationMs

  const accessToken = await new SignJWT(claims)
    .setIssuer(process.env.API_URL!)
    .setAudience(process.env.CLIENT_URL!)
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAtMs / 1000))
    .setProtectedHeader({ alg: "HS256" })
    .sign(SECRET)

  const authUser: AuthUser = {
    verifiedEmail: claims.email_verified,
    authLevel: claims.auth_level,
    expiresAt: expiresAtMs,
  }
  return { accessToken, authUser }
}

export const validateAccessToken = async (
  token: string,
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
        "UNEXPECTED_ERROR",
      ),
    )
  }
}
