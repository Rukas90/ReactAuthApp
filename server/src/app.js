import dotenv from 'dotenv'

dotenv.config()
console.log("Environment variables initialized")

const { Server } = await import('./server.js')

const server = new Server(process.env.SERVER_PORT || 3000)
await server.initialize()

console.log("Server initialized")

server.start()

/*
const { getOAuthProviders } = await import('#queries/oauth.queries.js')

const providers = await getOAuthProviders()

console.log(providers)

for (let i = 0; i < providers.length -1; i++) {
    console.log(providers[i])
}
*/