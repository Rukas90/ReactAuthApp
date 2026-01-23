import { Request, Response, NextFunction } from "express"
import { InvalidAuthLevelError } from "../errors"
import { AuthLevel } from "@project/shared"
import { syncRoute } from "../util"

export const requireAuthLevel = (level: AuthLevel) =>
  syncRoute((req: Request, _: Response, next: NextFunction) => {
    const auth = req.session.auth

    if (!auth || auth.claims.auth_level !== level) {
      return next(new InvalidAuthLevelError())
    }
    next()
  })
