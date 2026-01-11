import { DomainError } from "./domain.error.base"
import { DomainErrorType } from "./domain.error.type"

export class ValidationError extends DomainError {
  public override readonly type = DomainErrorType.VALIDATION
}

export class InvalidOperationError extends DomainError {
  public override readonly type = DomainErrorType.INVALID_OPERATION
}

export class UnprocessableContentError extends DomainError {
  public override readonly type = DomainErrorType.UNPROCESSABLE_CONTENT
}
