import { Express } from "express"
import { Router } from "express"
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

authRouter.post("/login", validateCaptchaToken, loginHandler)

authRouter.post(
  "/register",
  validateRegisterEmail,
  validateRegisterPassword,
  validateCaptchaToken,
  registerHandler
)

authRouter.post("/logout", logoutHandler)

authRouter.get("/status", authStatusHandler)
