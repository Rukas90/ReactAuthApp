import { Request, Response, NextFunction } from "express"
import { type Scope } from "@shared/token"
import { InvalidScopeError } from "../errors"

export const requireScope =
  (scope: Scope) => (req: Request, _: Response, next: NextFunction) => {
    const auth = req.session.auth

    if (!auth || !auth.scope.includes(scope)) {
      return next(new InvalidScopeError())
    }
    next()
  }
