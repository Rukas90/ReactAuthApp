import { Express, type Request, type Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger.config'

export const useSwaggerDocs = (app: Express) => {
    app.get('docs.json', (_: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}