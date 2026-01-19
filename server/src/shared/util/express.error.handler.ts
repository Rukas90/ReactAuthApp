import { NextFunction, Request, RequestHandler, Response } from "express"
import { AuthRequest } from "./authenticated.request"

export const asyncRoute = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export const authRoute = (
  fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as AuthRequest, res, next)).catch(next)
  }
}

export const syncRoute = (
  fn: (req: Request, res: Response, next: NextFunction) => any,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export const authSyncRoute = (
  fn: (req: AuthRequest, res: Response, next: NextFunction) => any,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      fn(req as AuthRequest, res, next)
    } catch (error) {
      next(error)
    }
  }
}
