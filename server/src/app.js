import dotenv      from 'dotenv'
import { Server }  from './server.js'

dotenv.config()

const server = new Server(process.env.SERVER_PORT || 3000)

server.start()