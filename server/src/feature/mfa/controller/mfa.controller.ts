import { Express, Router } from "express"
import {
  authenticateRequest,
  requireScope,
  requireAuthLevel,
  validateMfaMethod,
} from "@shared/middleware"
import {
  getInitEnrollmentData,
  getUserConfiguredEnrollments,
} from "./mfa.handler"

export const useMfaRoutes = (app: Express) => {
  app.use("/v1/auth", router)
}
const router = Router()

router.get(
  "/mfa/enrollments",
  authenticateRequest,
  getUserConfiguredEnrollments
)

router.post(
  "/mfa/enrollments/:method/initialize",
  authenticateRequest,
  requireScope("user:access"),
  requireAuthLevel("full"),
  validateMfaMethod,
  getInitEnrollmentData
)

router.post(
  "/mfa/enrollments/:method/confirm",
  authenticateRequest,
  requireScope("user:access"),
  requireAuthLevel("full"),
  validateMfaMethod
)

router.delete(
  "/mfa/enrollments/:method",
  authenticateRequest,
  requireScope("user:access"),
  requireAuthLevel("full"),
  validateMfaMethod
)

router.post(
  "/mfa/:method/verify",
  authenticateRequest,
  requireScope("2fa:verify"),
  validateMfaMethod
)
