import { asyncRoute, AuthRequest, authRoute } from "@shared/util"
import { NextFunction, Response, Request } from "express"
import verificationService from "../service/verification.service"
import { config } from "@base/app"

export const verifyCodeHandler = authRoute(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const code = req.body.code

    const verification = await verificationService.verifyVerification(code)

    if (!verification.ok) {
      return next(verification.error)
    }
    res.ok("Verified successfully!")
  },
)
export const verifyTokenHandler = asyncRoute(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.query.token as string

    const verification = await verificationService.verifyVerification(token)

    if (!verification.ok) {
      return next(verification.error)
    }
    res.redirect(config().origin.client)
  },
)
