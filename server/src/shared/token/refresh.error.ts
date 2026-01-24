import { RefreshErrorCodes } from "@project/shared"
import { AccessDeniedError } from "../errors/access.error"
import { ResourceMissingError } from "../errors/resource.error"

export abstract class RefreshTokenError extends AccessDeniedError {}

export class RefreshTokenInvalidError extends RefreshTokenError {
  constructor() {
    super("Refresh token is invalid.", RefreshErrorCodes.REFRESH_TOKEN_INVALID)
  }
}
export class RefreshTokenExpiredError extends RefreshTokenError {
  constructor() {
    super("Refresh token is expired.", RefreshErrorCodes.REFRESH_TOKEN_EXPIRED)
  }
}
export class RefreshTokenReusedError extends RefreshTokenError {
  constructor() {
    super(
      "Token reuse detected. All tokens in this session have been revoked.",
      RefreshErrorCodes.REFRESH_TOKEN_REUSED,
    )
  }
}
export class RefreshTokenNotFoundError extends ResourceMissingError {
  constructor() {
    super(
      "Refresh token is not found.",
      RefreshErrorCodes.REFRESH_TOKEN_NOT_FOUND,
    )
  }
}
