import {
  AccessForbiddenError,
  InvalidOperationError,
  RateLimitExceededError,
  ResourceMissingError,
  UnexpectedError,
} from "@shared/errors"
import { UserErrorCodes, RETRY_AFTER_MS_FIELD_NAME } from "@project/shared"

export class UserNotFoundError extends ResourceMissingError {
  constructor() {
    super("User is not found.", UserErrorCodes.USER_NOT_FOUND)
  }
}
export class UserPasswordMatchError extends InvalidOperationError {
  constructor() {
    super("Passwords do not match.", UserErrorCodes.USER_PASSWORD_NOT_MATCH)
  }
}
export class UserFailedToDeleteError extends UnexpectedError {
  constructor() {
    super("Failed to delete user account.", UserErrorCodes.USER_DELETE_FAILED)
  }
}
export class UserEmailVerificationCooldownError extends RateLimitExceededError {
  constructor(retryAfterMs: number) {
    super(
      "Email verification was requested too recently.",
      UserErrorCodes.USER_EMAIL_VERIFICATION_COOLDOWN,
      { data: { [RETRY_AFTER_MS_FIELD_NAME]: retryAfterMs } },
    )
  }
}
export class UserSessionCannotRevokeCurrentError extends InvalidOperationError {
  constructor() {
    super(
      "Cannot revoke own current session.",
      UserErrorCodes.USER_SESSION_CANNOT_REVOKE_CURRENT,
    )
  }
}
export class UserRevokeForeignSessionError extends AccessForbiddenError {
  constructor() {
    super("Cannot revoke foreign session.", UserErrorCodes.USER_REVOKE_FOREIGN)
  }
}
