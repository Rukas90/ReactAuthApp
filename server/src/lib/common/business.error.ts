import { AccessDeniedError } from "./domain.error"

export class InvalidCredentialsError extends AccessDeniedError {
  constructor() {
    super("Invalid credentials", "INVALID_CREDENTIALS")
  }
}
