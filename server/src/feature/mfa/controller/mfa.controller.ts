import { Express, Router } from "express"
import {
  authenticateRequest,
  requireScope,
  requireAuthLevel,
  validateBody,
} from "@shared/middleware"
import {
  initializeTotpData,
  getUserConfiguredEnrollments,
  deleteMfaEnrollment,
  confirmTotp,
} from "./mfa.handler"
import validateMfaMethod from "../middleware/validate.method.middleware"
import z from "zod"

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
  initializeTotpData,
)

const codeSchema = z.object({
  code: z.string().length(6),
})

router.post(
  "/totp/confirm",
  authenticateRequest,
  requireScope("user:access"),
  requireAuthLevel("full"),
  validateBody(codeSchema),
  confirmTotp,
)

router.delete(
  "/:method",
  authenticateRequest,
  requireScope("user:access"),
  requireAuthLevel("full"),
  validateMfaMethod,
  deleteMfaEnrollment,
)

router.post("/totp/verify", authenticateRequest, requireScope("2fa:verify"))
