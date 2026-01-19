import { UnexpectedError } from "./system.error"

export class TotpError extends UnexpectedError {
  constructor(message: string, code: string) {
    super(message, code)
  }
}
