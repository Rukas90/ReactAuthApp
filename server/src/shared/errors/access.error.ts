import { DomainError } from "./domain.error.base"
import { DomainErrorType } from "./domain.error.type"

export class AccessDeniedError extends DomainError {
  public override readonly type = DomainErrorType.ACCESS_DENIED
}

export class AccessForbiddenError extends DomainError {
  public override readonly type = DomainErrorType.ACCESS_FORBIDDEN
}
