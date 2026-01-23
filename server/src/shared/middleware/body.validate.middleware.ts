import { Request, Response, NextFunction } from "express"
import { asyncRoute } from "../util"
import type z from "zod"

export const validateBody = (schema: z.ZodTypeAny) =>
  asyncRoute(async (req: Request, _: Response, next: NextFunction) => {
    const body = req.body
    const result = await schema.safeParseAsync(body)

    if (result.success) {
      return next()
    }
    next(result.error)
  })
