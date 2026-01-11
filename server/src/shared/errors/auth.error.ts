import { AccessDeniedError } from "./access.error"

export class InvalidCredentialsError extends AccessDeniedError {
  constructor() {
    super("Invalid credentials", "INVALID_CREDENTIALS")
  }
}
export class UnauthenticatedError extends AccessDeniedError {
  constructor() {
    super("Unauthenticated", "UNAUTHENTICATED")
  }
}
