import { Express, Router } from "express"
import {
  deleteUserAccountHandler,
  getUserProfileHandler,
  getUserSessionsHandler,
  revokeUserSessionHandler,
  sendEmailVerificationHandler,
  updateUserPasswordHandler,
} from "./user.handler"
import { authenticateRequest, requireScope } from "@features/auth"
import { validateCsrf } from "@features/csrf"

const useRoutes = (app: Express) => {
  app.use("/v1/user", router)
}
const router = Router()

/**
 * @openapi
 * /v1/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get(
  "/profile",
  authenticateRequest,
  requireScope("admin:access"),
  getUserProfileHandler,
)

router.post(
  "/password",
  validateCsrf,
  authenticateRequest,
  requireScope("admin:access"),
  updateUserPasswordHandler,
)

router.get(
  "/sessions",
  authenticateRequest,
  requireScope("admin:access"),
  getUserSessionsHandler,
)

router.delete(
  "/:sessionId",
  validateCsrf,
  authenticateRequest,
  requireScope("admin:access"),
  revokeUserSessionHandler,
)

router.delete(
  "/",
  validateCsrf,
  authenticateRequest,
  requireScope("admin:access"),
  deleteUserAccountHandler,
)

router.post(
  "/email-verifications",
  validateCsrf,
  authenticateRequest,
  requireScope("admin:access"),
  sendEmailVerificationHandler,
)

export default useRoutes
