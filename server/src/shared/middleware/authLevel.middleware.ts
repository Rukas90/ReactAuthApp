import { Request, Response, NextFunction } from "express"
import { InvalidAuthLevelError } from "../errors"
import { AuthLevel } from "@project/shared"

export const requireAuthLevel =
  (level: AuthLevel) => (req: Request, _: Response, next: NextFunction) => {
    const session = req.session.auth

    if (!session || session.auth_level !== level) {
      return next(new InvalidAuthLevelError())
    }
    next()
  }
