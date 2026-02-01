import { validateBody } from "@shared/middleware"
import { authenticateRequest, requireScope } from "@features/auth"
import { verifyCodeSchema } from "@project/shared"
import { Express, Router } from "express"
import { verifyCodeHandler, verifyTokenHandler } from "./verification.handler"
import { validateCsrf } from "@features/csrf"

const useRoutes = (app: Express) => {
  app.use("/v1/verify", router)
}
const router = Router()

router.post(
  "/code",
  validateCsrf,
  authenticateRequest,
  requireScope("admin:access"),
  validateBody(verifyCodeSchema),
  verifyCodeHandler,
)
router.get("/token", verifyTokenHandler)

export default useRoutes
