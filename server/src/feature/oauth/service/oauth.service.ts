import { OAuthProvider, Result } from "@project/shared"
import { OAuthConfig, oauthConfig } from "../config/oauth.config"
import { OAuth, User } from "@prisma/client"
import { database } from "@base/app"
import { getUserByEmail, createNewUser, verifyUser } from "@features/user"
import crypto from "crypto"
import {
  OAuthEmailNotProvidedError,
  OAuthFailedToAuthenticateError,
  OAuthTokenExchangeError,
} from "../error/oauth.error"
import { OAuthSession } from "@shared/util"
import { fetchUserInfo } from "./userInfo.service"

export type OAuthTokens = {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
  scope?: string
}
export type OAuthUserInfo = {
  providerId: string
  email: string
  name: string
  emailVerified: boolean
  username?: string
}

export const getAuthorizationUrl = (
  provider: OAuthProvider,
  state: string,
  codeChallenge: string,
) => {
  const config = oauthConfig[provider]
  const params = createUrlSearchParams(config, state, codeChallenge)

  return `${config.authUrl}?${params.toString()}`
}
const createUrlSearchParams = (
  config: OAuthConfig,
  state: string,
  codeChallenge: string,
): URLSearchParams => {
  return new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: config.scope,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    prompt: "consent",
  })
}

export const processOAuthRequest = async (
  session: OAuthSession & { code: string },
): Promise<
  Result<
    { tokens: OAuthTokens; userInfo: OAuthUserInfo; session: OAuthSession },
    Error
  >
> => {
  const tokenResult = await exchangeCodeForToken(
    session.provider,
    session.code,
    session.verifier,
  )
  if (!tokenResult.ok) {
    return Result.error(tokenResult.error)
  }
  const userInfo = await fetchUserInfo(
    session.provider,
    tokenResult.data.accessToken,
  )
  if (!userInfo.ok) {
    return Result.error(userInfo.error)
  }
  return Result.success({
    tokens: tokenResult.data,
    userInfo: userInfo.data,
    session: session,
  })
}

export const exchangeCodeForToken = async (
  provider: OAuthProvider,
  code: string,
  codeVerifier: string,
): Promise<Result<OAuthTokens, OAuthTokenExchangeError>> => {
  const config = oauthConfig[provider]

  try {
    const body = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
      code_verifier: codeVerifier,
    })
    const response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body,
    })
    if (!response.ok) {
      console.error(
        `OAuth token exchange error for ${provider}:`,
        await response.text(),
      )
      return Result.error(new OAuthFailedToAuthenticateError(provider))
    }
    const data = await response.json()

    return Result.success({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      scope: data.scope,
    })
  } catch (error) {
    console.error(`OAuth token exchange error for ${provider}:`, error)
    return Result.error(new OAuthFailedToAuthenticateError(provider))
  }
}

export const authenticateOAuthAccount = async (
  session: OAuthSession,
  userInfo: OAuthUserInfo,
): Promise<Result<OAuth & { user: User }, Error>> => {
  if (!userInfo.email) {
    return Result.error(new OAuthEmailNotProvidedError())
  }
  let oauthAccount = await getOAuthAccount(
    userInfo.providerId,
    session.provider,
  )
  if (!oauthAccount) {
    oauthAccount = await createOAuthAccount(
      userInfo.email,
      userInfo.emailVerified,
      session.provider,
      userInfo.providerId,
      userInfo.username,
    )
  }
  if (!!userInfo.username && userInfo.username !== oauthAccount.username) {
    await updateOAuthUsername(oauthAccount.id, userInfo.username)
  }
  return Result.success(oauthAccount)
}

export const getOAuthAccount = async (
  providerId: string,
  provider: OAuthProvider,
): Promise<(OAuth & { user: User }) | null> => {
  return await database.client.oAuth.findUnique({
    where: {
      provider_provider_id: {
        provider,
        provider_id: providerId,
      },
    },
    include: { user: true },
  })
}
export const createOAuthAccount = async (
  email: string,
  isVerified: boolean,
  provider: OAuthProvider,
  providerId: string,
  username?: string,
): Promise<OAuth & { user: User }> => {
  let user = await getUserByEmail(email)

  if (!user) {
    user = await createNewUser(email, isVerified)
  }
  if (!user.is_verified && isVerified) {
    await verifyUser(user.id)
  }
  return await database.client.oAuth.create({
    data: {
      user_id: user.id,
      provider,
      provider_id: providerId,
      username: username,
    },
    include: {
      user: true,
    },
  })
}
export const updateOAuthUsername = async (
  oauthId: string,
  username: string,
) => {
  await database.client.oAuth.update({
    where: {
      id: oauthId,
    },
    data: {
      username,
    },
  })
}
export const generatePKCE = () => {
  const verifier = crypto.randomBytes(32).toString("base64url")
  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url")

  return { verifier, challenge }
}
