import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Service API',
            version: '1.0.0',
            description: 'API documentation for the User service',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: [
        'src/feature/**/*.ts',
    ],
}
export const swaggerSpec = swaggerJsdoc(options)