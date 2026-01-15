import { appConfig } from "@base/app"
import { CookieOptions } from "express"

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: appConfig.isProduction,
  sameSite: "lax",
  path: "/",
}
export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: appConfig.isProduction,
  sameSite: "lax",
  path: "/",
}
