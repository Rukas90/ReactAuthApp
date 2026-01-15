import { UnexpectedError } from "./system.error"

export abstract class TotpError extends UnexpectedError {}

export class TotpGetDataError extends TotpError {
  constructor() {
    super("Failed to acquire totp data.", "")
  }
}
