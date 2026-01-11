import { apiReference } from '@scalar/express-api-reference'
import { Express } from 'express'
import { swaggerSpec } from './swagger.config'

export const useScalarDocs = (app: Express) => {
    app.get('/openapi.json', (_, res) => {
        res.json(swaggerSpec)
    })
    app.use(
        '/api/docs',
        apiReference({
            sources: [{
                content: swaggerSpec
            }],
            theme: 'fastify',
            layout: 'modern',
        })
    )
}

