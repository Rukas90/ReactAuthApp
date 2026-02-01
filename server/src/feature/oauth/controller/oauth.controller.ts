import { Express, Router } from "express"
import { validateOAuthProvider } from "../middleware/oauthProvider.validate.middleware"
import {
  disconnectOAuthMethodHandler,
  handleOAuthCallback,
  initiateOAuth,
} from "./oauth.handler"
import { authenticateRequest, requireScope } from "@features/auth"
import { validateCsrf } from "@features/csrf"

const useRoutes = (app: Express) => {
  app.use("/v1/oauth", router)
}
const router = Router()

router.get("/:provider", validateOAuthProvider, initiateOAuth)
router.get("/:provider/callback", handleOAuthCallback)
router.post(
  "/:provider/disconnect",
  validateCsrf,
  authenticateRequest,
  requireScope("admin:access"),
  validateOAuthProvider,
  disconnectOAuthMethodHandler,
)
export default useRoutes
