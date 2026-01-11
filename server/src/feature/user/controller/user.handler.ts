import { NextFunction, Request, Response } from "express"
import { getUserById } from "../service/user.service"
import { Result } from "@shared/types"

export const getUserByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await getUserById(req.params.id)

  return Result.tap(
    result,
    (user) => res.ok(user),
    (error) => next(error)
  )
}
