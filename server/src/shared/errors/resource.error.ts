import { DomainError } from "./domain.error.base"
import { DomainErrorType } from "./domain.error.type"

export class ResourceMissingError extends DomainError {
  public override readonly type = DomainErrorType.RESOURCE_MISSING
}

export class ConflictError extends DomainError {
  public override readonly type = DomainErrorType.CONFLICT
}
