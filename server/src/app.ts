import { server } from "#lib/app/server.js"
import dotenv from "dotenv"
import { useUserRoutes } from "./feature/user/user.controller"
import { endpointErrorHandler } from "#lib/middleware/error.middleware.js"
import { useScalarDocs } from "./lib/config/docs/scalar"
import { isDevelopment } from "#lib/util/app.util.js"
import { useSwaggerDocs } from "#lib/config/docs/swagger.js"
import { useAuthRoutes } from "#features/auth/auth.controller"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import cors from "cors"

dotenv.config()
server.initialize()

const app = server.app
const port = Number.parseInt(process.env.SERVER_PORT ?? "3000", 10)

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  cors({
    origin: "http://192.168.1.119:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "X-CSRF-TOKEN"],
  })
)

useUserRoutes(app)
useAuthRoutes(app)

app.use(endpointErrorHandler)

if (isDevelopment()) {
  useSwaggerDocs(app)
  useScalarDocs(app)
}
await server.start(port)
