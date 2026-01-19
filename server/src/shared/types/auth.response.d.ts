import * as express from "express"
import { type AccessTokenPayload } from "../token/jwt.service"
import "express-session"
import { AuthSession, OAuthSession } from "../util"

declare module "express-session" {
  interface SessionData {
    auth?: AuthSession
    oauth?: OAuthSession
  }
}
