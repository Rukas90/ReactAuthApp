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
import { validateCsrf } from "@features/csrf"

const useRoutes = (app: Express) => {
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
  validateCsrf,
  authenticateRequest,
  requireScope("admin:access"),
  initializeTotpData,
)
router.post(
  "/totp/confirm",
  validateCsrf,
  authenticateRequest,
  requireScope("admin:access"),
  validateBody(totpCodeSchema),
  confirmTotp,
)
router.post(
  "/totp/login",
  validateCsrf,
  authenticateRequest,
  requireScope("mfa:verify"),
  validateBody(totpCodeSchema),
  loginTotp,
)
router.post(
  "/totp/verify",
  validateCsrf,
  authenticateRequest,
  requireScope(["admin:access", "mfa:verify"], "any"),
  validateBody(totpCodeSchema),
)
router.delete(
  "/:method",
  validateCsrf,
  authenticateRequest,
  requireScope("admin:access"),
  validateMfaMethod,
  deleteMfaEnrollment,
)

export default useRoutes
