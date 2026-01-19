import { InvalidOperationError, UnexpectedError } from "@shared/errors"
import { OAuthProvider } from "@project/shared"

export abstract class OAuthTokenExchangeError extends UnexpectedError {}

export class OAuthFailedToAuthenticateError extends OAuthTokenExchangeError {
  constructor(provider: OAuthProvider) {
    super(`Failed to authenticate with ${provider}`, "TOKEN_EXCHANGE_FAILED")
  }
}

export class OAuthInvalidStateError extends InvalidOperationError {
  constructor() {
    super("Invalid state parameter!", "INVALID_STATE")
  }
}
export class OAuthMissingAuthorizationCodeError extends InvalidOperationError {
  constructor() {
    super("Authorization code missing!", "AUTHORIZATION_CODE_MISSING")
  }
}
export class OAuthEmailNotProvidedError extends InvalidOperationError {
  constructor() {
    super(
      "Email not provided by OAuth provider. Please make your email public.",
      "OAUTH_EMAIL_MISSING"
    )
  }
}
