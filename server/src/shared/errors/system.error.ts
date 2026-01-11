import { DomainError } from "./domain.error.base"
import { DomainErrorType } from "./domain.error.type"

export class OperationTimeoutError extends DomainError {
  public override readonly type = DomainErrorType.OPERATION_TIMEOUT
}

export class RateLimitExceededError extends DomainError {
  public override readonly type = DomainErrorType.RATE_LIMIT
}

export class UnexpectedError extends DomainError {
  public override readonly type = DomainErrorType.UNEXPECTED
}
