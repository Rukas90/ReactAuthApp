import { NextFunction, Request, Response } from "express"

export const asyncRoute = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
export const syncRoute = (
  fn: (req: Request, res: Response, next: NextFunction) => void
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
