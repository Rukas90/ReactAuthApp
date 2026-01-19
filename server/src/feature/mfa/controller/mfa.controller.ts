import { Express, Router } from "express"
import {
  authenticateRequest,
  requireScope,
  requireAuthLevel,
} from "@shared/middleware"
import {
  getInitEnrollmentData,
  getUserConfiguredEnrollments,
} from "./mfa.handler"

export const useMfaRoutes = (app: Express) => {
  app.use("/v1/auth/mfa", router)
}
const router = Router()

router.get("/enrollments", authenticateRequest, getUserConfiguredEnrollments)

router.post(
  "/totp/initialize",
  authenticateRequest,
  requireScope("user:access"),
  requireAuthLevel("full"),
  getInitEnrollmentData
)

router.post(
  "/totp/confirm",
  authenticateRequest,
  requireScope("user:access"),
  requireAuthLevel("full")
)

router.delete(
  "/totp",
  authenticateRequest,
  requireScope("user:access"),
  requireAuthLevel("full")
)

router.post("/totp/verify", authenticateRequest, requireScope("2fa:verify"))
