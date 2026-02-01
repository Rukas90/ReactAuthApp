import { Express, Router } from "express"
import {
  authUserHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
} from "./auth.handler"
import { validateCaptchaToken } from "@features/captcha"
import { validateBody } from "@base/shared/middleware"
import { LoginSchema, RegisterSchema } from "@project/shared"
import { validateCsrf } from "@features/csrf"

const useRoutes = (app: Express) => {
  app.use("/v1/auth", router)
}
const router = Router()

router.post(
  "/login",
  validateCsrf,
  validateBody(LoginSchema),
  validateCaptchaToken,
  loginHandler,
)

router.post(
  "/register",
  validateCsrf,
  validateBody(RegisterSchema),
  validateCaptchaToken,
  registerHandler,
)

router.post("/logout", validateCsrf, logoutHandler)

router.get("/session", authUserHandler)

router.post("/refresh", refreshHandler)

export default useRoutes
