import { AccessDeniedError, AccessForbiddenError } from "./access.error"

export class InvalidCredentialsError extends AccessDeniedError {
  constructor() {
    super("Invalid credentials", "INVALID_CREDENTIALS")
  }
}
export class UnauthenticatedError extends AccessDeniedError {
  constructor() {
    super("Unauthenticated", "UNAUTHENTICATED")
  }
}
export abstract class RefreshTokenError extends AccessDeniedError {}

export class RefreshTokenInvalidError extends RefreshTokenError {
  constructor() {
    super("Refresh token is invalid.", "REFRESH_TOKEN_INVALID")
  }
}
export class RefreshTokenExpiredError extends RefreshTokenError {
  constructor() {
    super("Refresh token is expired.", "REFRESH_TOKEN_EXPIRED")
  }
}
export class RefreshTokenReusedError extends RefreshTokenError {
  constructor() {
    super(
      "Token reuse detected. All tokens in this session have been revoked.",
      "REFRESH_TOKEN_REUSED"
    )
  }
}

export class InvalidScopeError extends AccessForbiddenError {
  constructor() {
    super("Session does not include required auth scope.", "INVALID_AUTH_SCOPE")
  }
}
export class InvalidAuthLevelError extends AccessForbiddenError {
  constructor() {
    super("Session does not include required auth level.", "INVALID_AUTH_LEVEL")
  }
}
