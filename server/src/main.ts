import { server } from "@base/app"
import "dotenv/config"
import dotenv from "dotenv"
import { useUserRoutes } from "@features/user"
import { useAuthRoutes } from "@features/auth"
import { endpointErrorHandler } from "@shared/middleware"
import { useScalarDocs } from "./shared/docs/scalar"
import { isDevelopment } from "@base/app"
import { useSwaggerDocs } from "@shared/docs"
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
    origin: [
      "http://192.168.1.119:5173",
      "http://192.168.1.120:5173",
      "http://localhost:5173",
    ],
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
