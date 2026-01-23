import {
  ConflictError,
  InvalidOperationError,
  ResourceMissingError,
  UnexpectedError,
  ValidationError,
} from "@shared/errors"

export class InvalidMfaMethodError extends ValidationError {
  constructor() {
    super("Invalid mfa method provided!", "INVALID_MFA_METHOD")
  }
}
export class MfaAlreadyConfiguredError extends ConflictError {
  constructor() {
    super(
      "Mfa enrollment is already completed for this user.",
      "MFA_ALREADY_CONFIGURED",
    )
  }
}
export class MfaNotFoundError extends ResourceMissingError {
  constructor() {
    super("Mfa enrollment is not found.", "ENROLLMENT_NOT_FOUND")
  }
}
export class MfaCredentialsMissingError extends UnexpectedError {
  constructor() {
    super(
      "MFA enrollment is missing required credentials.",
      "MFA_CREDENTIALS_MISSING",
    )
  }
}
export class MfaVerificationError extends UnexpectedError {
  constructor() {
    super("MFA could not be verified successfully!.", "MFA_BAD_VERIFY")
  }
}
export class MfaInvalidCodeError extends ConflictError {
  constructor() {
    super("The provided MFA code is invalid.", "MFA_INVALID_CODE")
  }
}
export class MfaEnrollmentExpiredError extends InvalidOperationError {
  constructor() {
    super("The enrollment is expired and no longer valid.", "MFA_EXPIRED")
  }
}
