import { DomainErrorType } from "./domain.error.type"

export abstract class DomainError extends Error {
  public abstract readonly type: DomainErrorType
  public readonly code: string

  constructor(message: string, code: string, options?: { cause?: unknown }) {
    super(message, options)
    this.code = code
    this.name = new.target.name
  }
}
