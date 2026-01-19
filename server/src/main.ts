import { server } from "@base/app"
import "dotenv/config"
import dotenv from "dotenv"
import { useUserRoutes } from "@features/user"
import { useAuthRoutes } from "@features/auth"
import { useOAuthRoutes } from "@features/oauth"
import { useMfaRoutes } from "@features/mfa"
import { endpointErrorHandler } from "@shared/middleware"
import { useScalarDocs } from "./shared/docs/scalar"
import { appConfig } from "@base/app"
import { useSwaggerDocs } from "@shared/docs"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import cors from "cors"
import session from "express-session"
import ms from "ms"

dotenv.config()
server.initialize()

const app = server.app
const port = Number.parseInt(process.env.SERVER_PORT ?? "3000", 10)

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  cors({
    origin: ["http://www.127.0.0.1.sslip.io:5173", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "X-CSRF-TOKEN",
      "Access-Control-Allow-Origin",
    ],
  }),
)
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: appConfig.isProduction,
      sameSite: "lax",
      maxAge: ms("15m"),
    },
  }),
)

useUserRoutes(app)
useAuthRoutes(app)
useOAuthRoutes(app)
useMfaRoutes(app)

app.use(endpointErrorHandler)

if (appConfig.isDevelopment) {
  useSwaggerDocs(app)
  useScalarDocs(app)
}
await server.start(port)
