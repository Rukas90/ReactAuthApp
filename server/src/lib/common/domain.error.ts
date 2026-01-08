export abstract class DomainError extends Error {
  public abstract readonly type: DomainErrorType
  public readonly code: string

  constructor(message: string, code: string, options?: { cause?: unknown }) {
    super(message, options)

    this.code = code
    this.name = new.target.name
  }
}
export enum DomainErrorType {
  INVALID_OPERATION,
  VALIDATION,
  ACCESS_DENIED,
  ACCESS_FORBIDDEN,
  RESOURCE_MISSING,
  OPERATION_TIMEOUT,
  CONFLICT,
  UNPROCESSABLE_CONTENT,
  RATE_LIMIT,
  UNEXPECTED,
}

export class InvalidOperationError extends DomainError {
  public override readonly type: DomainErrorType =
    DomainErrorType.INVALID_OPERATION
}
export class ValidationError extends DomainError {
  public override readonly type: DomainErrorType = DomainErrorType.VALIDATION
}
export class AccessDeniedError extends DomainError {
  public override readonly type: DomainErrorType = DomainErrorType.ACCESS_DENIED
}
export class AccessForbiddenError extends DomainError {
  public override readonly type: DomainErrorType =
    DomainErrorType.ACCESS_FORBIDDEN
}
export class ResourceMissingError extends DomainError {
  public override readonly type: DomainErrorType =
    DomainErrorType.RESOURCE_MISSING
}
export class OperationTimeoutError extends DomainError {
  public override readonly type: DomainErrorType =
    DomainErrorType.OPERATION_TIMEOUT
}
export class ConflictError extends DomainError {
  public override readonly type: DomainErrorType = DomainErrorType.CONFLICT
}
export class UnprocessableContentError extends DomainError {
  public override readonly type: DomainErrorType =
    DomainErrorType.UNPROCESSABLE_CONTENT
}
export class RateLimitExceededError extends DomainError {
  public override readonly type: DomainErrorType = DomainErrorType.RATE_LIMIT
}
export class UnexpectedError extends DomainError {
  public override readonly type: DomainErrorType = DomainErrorType.UNEXPECTED
}
