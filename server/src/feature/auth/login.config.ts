import { CookieOptions } from "express"
import { isProduction } from "#lib/util/app.util.js"

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction(),
  sameSite: "lax",
  path: "/",
}
export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction(),
  sameSite: "lax",
  path: "/",
}
