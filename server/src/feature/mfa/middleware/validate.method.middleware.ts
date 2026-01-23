import { syncRoute } from "@base/shared/util"
import { Request, Response, NextFunction } from "express"
import { InvalidMfaMethodError } from "../error/validation.error"
import { MfaMethod, MfaMethodCollection } from "@project/shared"

const validateMfaMethod = syncRoute(
  (req: Request, _: Response, next: NextFunction) => {
    const method = req.params.method as MfaMethod

    if (!method || !MfaMethodCollection.includes(method)) {
      return next(new InvalidMfaMethodError())
    }
    next()
  },
)
export default validateMfaMethod
