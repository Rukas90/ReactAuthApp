import { Request, Response, NextFunction } from "express"
import { syncRoute } from "@base/shared/util"
import { InvalidOperationError } from "@shared/errors"
import { OAuthProvider, OAuthProviderCollection } from "@project/shared"

export const validateOAuthProvider = syncRoute(
  (req: Request, _: Response, next: NextFunction) => {
    const provider = req.params.provider as OAuthProvider

    if (!provider || !OAuthProviderCollection.includes(provider)) {
      return next(
        new InvalidOperationError(
          "Invalid oauth provider.",
          "INVALID_OAUTH_PROVIDER"
        )
      )
    }
    next()
  }
)
