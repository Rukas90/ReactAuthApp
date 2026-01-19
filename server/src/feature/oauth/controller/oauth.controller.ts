import { Express, Router } from "express"
import { validateOAuthProvider } from "../middleware/oauthProvider.validate.middleware"
import { handleOAuthCallback, initiateOAuth } from "./oauth.handler"

export const useOAuthRoutes = (app: Express) => {
  app.use("/v1/oauth", router)
}
const router = Router()

router.get("/:provider", validateOAuthProvider, initiateOAuth)
router.get("/:provider/callback", handleOAuthCallback)
