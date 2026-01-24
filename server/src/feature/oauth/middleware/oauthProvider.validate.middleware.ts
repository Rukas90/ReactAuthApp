import { Request, Response, NextFunction } from "express"
import { syncRoute } from "@shared/util"
import { OAuthProvider, OAuthProviderCollection } from "@project/shared"
import { OAuthInvalidProviderError } from "../error/oauth.error"

export const validateOAuthProvider = syncRoute(
  (req: Request, _: Response, next: NextFunction) => {
    const provider = req.params.provider as OAuthProvider

    if (!provider || !OAuthProviderCollection.includes(provider)) {
      return next(new OAuthInvalidProviderError())
    }
    next()
  },
)
