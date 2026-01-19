import * as express from "express"
import { AuthSession } from "./session.types"

export interface AuthRequest extends express.Request {
  session: express.Request["session"] & { auth: AuthSession }
}
