import dotenv      from 'dotenv'
import { Server }  from './server.js'
import { mail } from './mailer.js'

dotenv.config()

const server = new Server(process.env.SERVER_PORT || 3000)

server.start()

/*mail({
    recipient: 'watchfinddo@gmail.com',
    subject: 'Test Subject',
    body: 'Test Body...'
})*/