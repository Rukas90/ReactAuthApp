import * as express from "express"
import { type AccessTokenPayload } from "../token/jwt.service"

declare global {
  namespace Express {
    interface Request {
      session: AccessTokenPayload | null
    }
  }
}
