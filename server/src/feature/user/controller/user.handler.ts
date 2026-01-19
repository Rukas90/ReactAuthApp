import { NextFunction, Response } from "express"
import { getUserById } from "../service/user.service"
import { Result } from "@project/shared"
import { AuthRequest, authRoute } from "@shared/util"

export const getUserByIdHandler = authRoute(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const result = await getUserById(req.params.id as string)

    return Result.tap(
      result,
      (user) => res.ok(user),
      (error) => next(error),
    )
  },
)
