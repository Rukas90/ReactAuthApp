import { DomainErrorType } from "./domain.error.type"

export abstract class DomainError extends Error {
  public abstract readonly type: DomainErrorType
  public readonly code: string
  public readonly data?: Record<string, unknown>

  constructor(
    message: string,
    code: string,
    options?: { cause?: unknown; data?: Record<string, unknown> },
  ) {
    super(message, options)
    this.code = code
    this.data = options?.data
    this.name = new.target.name
  }
}
