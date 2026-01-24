import { OAuthProvider, Result } from "@project/shared"
import { oauthConfig } from "../config/oauth.config"
import { OAuthUserInfo } from "./oauth.service"
import {
  OAuthEmailNotProvidedError,
  OAuthUserInfoFetchFailedError,
} from "../error/oauth.error"

export type GithubEmail = {
  email: string
  verified: boolean
  primary: boolean
  visibility: string
}

const getGoogleUserInfo = async (
  accessToken: string,
): Promise<Result<OAuthUserInfo, OAuthUserInfoFetchFailedError>> => {
  const config = oauthConfig["google"]
  const response = await fetch(config.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  })
  if (!response.ok) {
    return Result.error(new OAuthUserInfoFetchFailedError("google"))
  }
  const data = await response.json()

  return Result.success({
    providerId: data.id.toString(),
    email: data.email,
    name: data.name,
    emailVerified: data.verified_email ?? false,
    username: data.email,
  })
}
const getGithubUserInfo = async (
  accessToken: string,
): Promise<
  Result<
    OAuthUserInfo,
    OAuthUserInfoFetchFailedError | OAuthEmailNotProvidedError
  >
> => {
  const config = oauthConfig["github"]
  const response = await fetch(config.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  })
  if (!response.ok) {
    return Result.error(new OAuthUserInfoFetchFailedError("github"))
  }
  const address = await getGithubAccountAddress(accessToken)

  if (!address.ok) {
    return Result.error(address.error)
  }
  const data = await response.json()

  return Result.success({
    providerId: data.id.toString(),
    email: address.data.email,
    name: data.name,
    emailVerified: address.data.verified,
    username: data.login,
  })
}
const getGithubAccountAddress = async (
  accessToken: string,
): Promise<Result<GithubEmail, OAuthEmailNotProvidedError>> => {
  try {
    const config = oauthConfig["github"]
    const emails: GithubEmail[] = await fetch(config.emailsUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((r) => r.json())

    let address =
      emails.find((e) => e.primary && e.verified) ??
      emails.find((e) => e.verified) ??
      emails.find((e) => e.primary)

    if (!address) {
      return Result.error(new OAuthEmailNotProvidedError())
    }
    return Result.success(address)
  } catch {
    return Result.error(new OAuthEmailNotProvidedError())
  }
}

export const fetchUserInfo = async (
  provider: OAuthProvider,
  accessToken: string,
) => {
  switch (provider) {
    case "google":
      return getGoogleUserInfo(accessToken)
    case "github":
      return getGithubUserInfo(accessToken)
  }
}
