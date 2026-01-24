import { MfaErrorCodes } from "@project/shared"
import {
  ConflictError,
  InvalidOperationError,
  ResourceMissingError,
  UnexpectedError,
  ValidationError,
} from "@shared/errors"

export class MfaInvalidMethodError extends ValidationError {
  constructor() {
    super("Invalid mfa method provided!", MfaErrorCodes.MFA_METHOD_INVALID)
  }
}
export class MfaAlreadyConfiguredError extends ConflictError {
  constructor() {
    super(
      "Mfa enrollment is already completed for this user.",
      MfaErrorCodes.MFA_ALREADY_CONFIGURED,
    )
  }
}
export class MfaNotFoundError extends ResourceMissingError {
  constructor() {
    super(
      "Mfa enrollment is not found.",
      MfaErrorCodes.MFA_ENROLLMENT_NOT_FOUND,
    )
  }
}
export class MfaCredentialsMissingError extends ValidationError {
  constructor() {
    super(
      "MFA enrollment is missing required credentials.",
      MfaErrorCodes.MFA_CREDENTIALS_MISSING,
    )
  }
}
export class MfaVerificationError extends UnexpectedError {
  constructor() {
    super(
      "MFA could not be verified successfully!.",
      MfaErrorCodes.MFA_VERIFICATION_FAILED,
    )
  }
}
export class MfaInvalidCodeError extends InvalidOperationError {
  constructor() {
    super("The provided MFA code is invalid.", MfaErrorCodes.MFA_INVALID_CODE)
  }
}
export class MfaEnrollmentExpiredError extends InvalidOperationError {
  constructor() {
    super(
      "The enrollment is expired and no longer valid.",
      MfaErrorCodes.MFA_EXPIRED,
    )
  }
}
export class MfaQRCodeGenerateError extends UnexpectedError {
  constructor() {
    super("Failed to generate QR code.", MfaErrorCodes.MFA_QR_GENERATION_FAILED)
  }
}
export class MfaDecryptionError extends UnexpectedError {
  constructor() {
    super("Failed to decrypt TOTP secret.", MfaErrorCodes.MFA_DECRYPTION_FAILED)
  }
}
export class MfaEnrollmentFetchFailedError extends UnexpectedError {
  constructor() {
    super(
      "Failed to get MFA enrollment data.",
      MfaErrorCodes.MFA_ENROLLMENT_FETCH_FAILED,
    )
  }
}
