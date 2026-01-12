import { Express, Router } from "express"
import {
  authUserHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
} from "./auth.handler"
import { validateCaptchaToken } from "@shared/middleware"

export const useAuthRoutes = (app: Express) => {
  app.use("/v1/auth", authRouter)
}
const authRouter = Router()

authRouter.post("/login", validateCaptchaToken, loginHandler)

authRouter.post("/register", validateCaptchaToken, registerHandler)

authRouter.post("/logout", logoutHandler)

authRouter.get("/user", authUserHandler)

authRouter.post("/refresh", refreshHandler)
