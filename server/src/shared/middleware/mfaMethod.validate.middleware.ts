import { NextFunction, Request, Response } from "express"
import { syncRoute } from "../util"
import { MfaMethod } from "@prisma/client"
import { InvalidOperationError } from "../errors"

const VALID_MFA_METHODS_SET = new Set(Object.values(MfaMethod))

export const validateMfaMethod = syncRoute(
  (req: Request, _: Response, next: NextFunction) => {
    const method = req.params.method as MfaMethod

    if (!VALID_MFA_METHODS_SET.has(method)) {
      return next(
        new InvalidOperationError("Invalid MFA method", "MFA_INVALID")
      )
    }
    next()
  }
)
