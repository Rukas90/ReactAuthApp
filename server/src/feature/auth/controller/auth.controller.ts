import { Express, Router } from "express"
import {
  authUserHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
} from "./auth.handler"
import { validateCaptchaToken } from "@features/captcha"
import { requireScope } from "../middleware/requireScope.middleware"

export const useAuthRoutes = (app: Express) => {
  app.use("/v1/auth", router)
}
const router = Router()

router.post("/login", validateCaptchaToken, loginHandler)

router.post("/register", validateCaptchaToken, registerHandler)

router.post("/logout", logoutHandler)

router.get("/session", authUserHandler)

router.post("/refresh", requireScope(["admin:access"]), refreshHandler)
