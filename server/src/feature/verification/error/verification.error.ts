import { InvalidOperationError, UnexpectedError } from "@base/shared/errors"

export class VerificationInvalidCode extends InvalidOperationError {
  constructor() {
    super("Invalid verification code.", "VERIFICATION_CODE_INVALID")
  }
}
export class VerificationNotValid extends InvalidOperationError {
  constructor() {
    super(
      "Verification is either invalid or expired.",
      "VERIFICATION_NOT_VALID",
    )
  }
}
export class VerificationDispatchFailure extends UnexpectedError {
  constructor() {
    super(
      "Failed to handle the verification dispatch.",
      "VERIFICATION_DISPATCH_FAILURE",
    )
  }
}
