import express, { Express } from "express"
import { database } from "#lib/app/database.js"
import http from "http"
import { extendResponse } from "#lib/config/response.extension.js"
import { transporter } from "#lib/mail/mailer.service.js"

class Server {
  #app: Express
  #server: http.Server | null = null

  get app() {
    return this.#app
  }
  constructor() {
    this.#app = express()
  }
  initialize() {
    extendResponse()
    this.#bindShutdownHandlers()
    this.#configureMiddleware()
  }
  #bindShutdownHandlers() {
    process.on("SIGTERM", () => this.#exit("SIGTERM"))
    process.on("SIGINT", () => this.#exit("SIGINT"))
  }
  #exit = async (signal: string) => {
    console.log(`Received ${signal}`)

    setTimeout(() => {
      console.error("Forcing shutdown")
      process.exit(1)
    }, 10_000)

    try {
      await this.shutdown()
      console.log("Shutdown complete")
    } catch (error) {
      console.error("Error during shutdown:", error)
    } finally {
      process.exit(0)
    }
  }
  #configureMiddleware() {
    this.#app.use(express.json())
  }
  async start(port: number): Promise<void> {
    if (this.#server) {
      console.warn("Server is already running.")
      return
    }
    await this.#connectDatabase()

    this.#server = http.createServer(this.#app)
    await new Promise<void>((resolve) => {
      this.#server!.listen(port, "0.0.0.0", () => {
        console.log(`Server initialized on port ${port}`)
        resolve()
      })
    })
  }
  async #connectDatabase(): Promise<void> {
    try {
      await database.connect(process.env["DATABASE_URL"]!)
      console.log("Database connected")
    } catch (error) {
      console.error("Failed to connect to database:", error)
      throw error
    }
  }
  async shutdown(): Promise<void> {
    if (this.#server == null) {
      console.warn("Shutdown called but server was never started")
      return
    }
    console.log("Shutting down server...")

    await new Promise<void>((resolve) => {
      this.#server!.close(() => {
        console.log("Server has shutdown")
        resolve()
      })
    })
    await database.disconnect()
    transporter.close()
  }
}
export const server = new Server()
