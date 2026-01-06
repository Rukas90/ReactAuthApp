import { NextFunction, Request, Response } from "express";

export const asyncRoute = (
    fn: (req: Request, res: Response, next: NextFunction, signal: AbortSignal) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const controller = new AbortController()
        const timeout    = setTimeout(() => controller.abort(), 5000)

        Promise.race([
            fn(req, res, next, controller.signal),
            new Promise((_, reject) => {
                controller.signal.addEventListener("abort", 
                    () => reject(new Error()), { once: true })
            })
        ]).catch(next).finally(() => { clearTimeout(timeout) })
    }
}
export const syncRoute = (
    fn: (req: Request, res: Response, next: NextFunction) => void
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const controller = new AbortController()
        const timeout    = setTimeout(() => controller.abort(), 5000)

        try {
            fn(req, res, next)
        }
        catch (error) {
            next(error)
        }
        finally {
            clearTimeout(timeout)
        }
    }
}