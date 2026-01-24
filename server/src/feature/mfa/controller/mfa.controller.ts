import { Express, Router } from "express"
import { validateBody } from "@shared/middleware"
import {
  initializeTotpData,
  getUserEnrollments,
  deleteMfaEnrollment,
  confirmTotp,
  loginTotp,
} from "./mfa.handler"
import validateMfaMethod from "../middleware/validate.method.middleware"
import { totpCodeSchema } from "@project/shared"
import { authenticateRequest, requireScope } from "@features/auth"

export const useMfaRoutes = (app: Express) => {
  app.use("/v1/mfa", router)
}
const router = Router()

router.get(
  "/enrollments",
  authenticateRequest,
  requireScope(["admin:access", "mfa:verify"], "any"),
  getUserEnrollments,
)

router.post(
  "/totp/initialize",
  authenticateRequest,
  requireScope("admin:access"),
  initializeTotpData,
)
router.post(
  "/totp/confirm",
  authenticateRequest,
  requireScope("admin:access"),
  validateBody(totpCodeSchema),
  confirmTotp,
)
router.delete(
  "/:method",
  authenticateRequest,
  requireScope("admin:access"),
  validateMfaMethod,
  deleteMfaEnrollment,
)

router.post(
  "/totp/login",
  authenticateRequest,
  requireScope("mfa:verify"),
  validateBody(totpCodeSchema),
  loginTotp,
)
router.post("/totp/verify", authenticateRequest, validateBody(totpCodeSchema))
