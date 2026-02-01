import { ResourceMissingError } from "@base/shared/errors"
import { SessionErrorCodes } from "@project/shared"

export class SessionNotFoundError extends ResourceMissingError {
  constructor() {
    super("Session is not found.", SessionErrorCodes.SESSION_NOT_FOUND)
  }
}
