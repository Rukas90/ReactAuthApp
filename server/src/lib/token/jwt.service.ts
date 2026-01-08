import { JWTPayload, SignJWT, jwtVerify } from "jose"
import { User } from "#prisma/client"
import { Result } from "#lib/common/result.js"
import { JOSEError } from "jose/errors"
import { UnexpectedError } from "#lib/common/domain.error.js"
import { TokenAuthState } from "#features/auth/utils/auth.type"

const ENCODER = new TextEncoder()
const SECRET = ENCODER.encode(process.env.JWT_SECRET!)

export interface AccessTokenPayload extends JWTPayload {
  acr: TokenAuthState
  isVerified: boolean
}
export const generateAccessToken = (
  user: User,
  state: TokenAuthState
): Promise<string> => {
  const expiration = state === "2fa-pending" ? "5m" : "15m"

  return new SignJWT({ acr: state, isVerified: user.is_verified })
    .setIssuer(process.env.API_URL!)
    .setAudience(process.env.CLIENT_URL!)
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(expiration)
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
