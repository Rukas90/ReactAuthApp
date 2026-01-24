import { generateCsrfToken } from "@features/csrf"
import { OAuthProvider, Result } from "@project/shared"
import { asyncRoute, OAuthSession } from "@shared/util"
import { Request, Response, NextFunction } from "express"
import {
  authenticateOAuthAccount,
  generatePKCE,
  getAuthorizationUrl,
  processOAuthRequest,
} from "../service/oauth.service"
import {
  OAuthInvalidStateError,
  OAuthMissingAuthorizationCodeError,
} from "../error/oauth.error"
import { establishUserAuthSession } from "@features/auth"

export const initiateOAuth = asyncRoute(
  async (req: Request, res: Response, _: NextFunction) => {
    const provider = req.params.provider as OAuthProvider

    const state = generateCsrfToken()
    const { verifier, challenge } = generatePKCE()

    req.session.oauth = {
      state,
      verifier,
      provider,
    }
    res.redirect(getAuthorizationUrl(provider, state, challenge))
  },
)

export const handleOAuthCallback = asyncRoute(
  async (req: Request, res: Response, next: NextFunction) => {
    const session = validateCallbackRequest(req)

    if (!session.ok) {
      return Result.error(session.error)
    }
    const oauth = await processOAuthRequest(session.data)

    if (!oauth.ok) {
      return next(oauth.error)
    }
    const auth = await authenticateOAuthAccount(
      oauth.data.session,
      oauth.data.userInfo,
    )
    if (!auth.ok) {
      return next(auth.error)
    }

    await establishUserAuthSession(res, auth.data.user)

    const url = new URL(process.env.CLIENT_ORIGIN!)
    url.pathname = "oauth/callback"

    res.redirect(url.toString())
  },
)

export const validateCallbackRequest = (
  req: Request,
): Result<OAuthSession & { code: string }, Error> => {
  const provider = req.params.provider as OAuthProvider
  const code = req.query.code as string | undefined
  const state = req.query.state as string | undefined

  if (!req.session.oauth) {
    return Result.error(new OAuthInvalidStateError())
  }
  const session: OAuthSession = {
    state: req.session.oauth.state,
    verifier: req.session.oauth.verifier,
    provider: req.session.oauth.provider,
  }
  delete req.session.oauth

  if (session.provider !== provider) {
    return Result.error(new OAuthInvalidStateError())
  }
  if (!state || !session.state || state !== session.state) {
    return Result.error(new OAuthInvalidStateError())
  }
  if (!code || typeof code !== "string") {
    return Result.error(new OAuthMissingAuthorizationCodeError())
  }
  if (!session.verifier) {
    return Result.error(new OAuthInvalidStateError())
  }
  return Result.success({ ...session, code })
}
