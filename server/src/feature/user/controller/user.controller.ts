import { Express } from 'express'
import { Router } from 'express'
import { asyncRoute } from '#lib/util/express.error.handler.js'
import { authenticateRequest } from '#lib/middleware/authenticate.middleware.js'
import { getUserByIdHandler } from './user.handler'

export const useUserRoutes = (app: Express) => {
    app.use('/v1/user', userRouter)
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
userRouter.get('/:id', 
  authenticateRequest, 
  asyncRoute(getUserByIdHandler))