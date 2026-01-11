import { authenticateRequest } from "@shared/middleware"
import { asyncRoute } from "@shared/util"
import { Express, Router } from "express"
import { getUserByIdHandler } from "./user.handler"

export const useUserRoutes = (app: Express) => {
  app.use("/v1/user", userRouter)
}
const userRouter = Router()

/**
 * @openapi
 * /v1/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
userRouter.get("/:id", authenticateRequest, asyncRoute(getUserByIdHandler))
