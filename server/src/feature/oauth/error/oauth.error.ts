import {
  InvalidOperationError,
  ResourceMissingError,
  UnexpectedError,
} from "@shared/errors"
import { OAuthErrorCodes, OAuthProvider } from "@project/shared"

export class OAuthFailedToAuthenticateError extends UnexpectedError {
  constructor(provider: OAuthProvider) {
    super(
      `Failed to authenticate with ${provider}`,
      OAuthErrorCodes.OAUTH_FAILED_TO_AUTHENTICATE,
    )
  }
}
export class OAuthInvalidStateError extends InvalidOperationError {
  constructor() {
    super("Invalid state parameter!", OAuthErrorCodes.OAUTH_INVALID_STATE)
  }
}
export class OAuthMissingAuthorizationCodeError extends InvalidOperationError {
  constructor() {
    super(
      "Authorization code missing!",
      OAuthErrorCodes.OAUTH_AUTHORIZATION_CODE_MISSING,
    )
  }
}
export class OAuthEmailNotProvidedError extends InvalidOperationError {
  constructor() {
    super(
      "Email not provided by OAuth provider. Please make your email public.",
      OAuthErrorCodes.OAUTH_EMAIL_NOT_PROVIDED,
    )
  }
}
export class OAuthInvalidProviderError extends InvalidOperationError {
  constructor(provider: OAuthProvider) {
    super(
      `Invalid OAuth provider. Provider: ${provider}`,
      OAuthErrorCodes.OAUTH_PROVIDER_INVALID,
    )
  }
}
export class OAuthUnsupportedProviderError extends InvalidOperationError {
  constructor(provider: OAuthProvider) {
    super(
      `Unsupported OAuth provider: ${provider}`,
      OAuthErrorCodes.OAUTH_PROVIDER_UNSUPPORTED,
    )
  }
}
export class OAuthUserInfoFetchFailedError extends UnexpectedError {
  constructor(provider: OAuthProvider) {
    super(
      `Failed to fetch user info from ${provider}.`,
      OAuthErrorCodes.OAUTH_USERINFO_FETCH_FAILED,
    )
  }
}
export class OAuthDisconnectNotPossibleError extends UnexpectedError {
  constructor(provider: OAuthProvider) {
    super(
      `Could not disconnect oauth "${provider}" provider from user. At least one login method must be available.`,
      OAuthErrorCodes.OAUTH_DISCONNECT_NOT_POSSIBLE,
    )
  }
}
export class OAuthProviderNotFoundError extends ResourceMissingError {
  constructor(provider: OAuthProvider) {
    super(
      `OAuth "${provider}" provider was not found.`,
      OAuthErrorCodes.OAUTH_NOT_FOUND,
    )
  }
}
