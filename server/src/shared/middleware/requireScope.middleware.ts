import { Request, Response, NextFunction } from "express"
import { type Scope } from "@shared/token"
import { InvalidScopeError } from "../errors"
import { syncRoute } from "../util"

export const requireScope = (scope: Scope) =>
  syncRoute((req: Request, _: Response, next: NextFunction) => {
    const auth = req.session.auth

    if (!auth || !auth.claims.scope.includes(scope)) {
      return next(new InvalidScopeError())
    }
    next()
  })
