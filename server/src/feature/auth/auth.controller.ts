import { Express } from "express"
import { Router } from "express"
import { syncRoute, asyncRoute } from "#lib/util/express.error.handler.js"
import {
  authStatusHandler,
  loginHandler,
  logoutHandler,
  registerHandler,
} from "./auth.handler"
import { validateRegisterPassword } from "#lib/middleware/register.password.middleware.js"
import { validateRegisterEmail } from "#lib/middleware/register.email.middleware.js"
import { validateCaptchaToken } from "#lib/middleware/captcha.validate.middleware.js"

export const useAuthRoutes = (app: Express) => {
  app.use("/v1/auth", authRouter)
}
const authRouter = Router()

authRouter.post("/login", validateCaptchaToken, asyncRoute(loginHandler))

authRouter.post(
  "/register",
  validateRegisterEmail,
  validateRegisterPassword,
  validateCaptchaToken,
  asyncRoute(registerHandler)
)

authRouter.post("/logout", asyncRoute(logoutHandler))

authRouter.get("status", syncRoute(authStatusHandler))
