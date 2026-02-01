type NodeEnv = "production" | "development"

class AppConfig {
  name: string
  env: NodeEnv
  origin: { api: string; client: string }
  isProduction: boolean
  isDevelopment: boolean

  constructor() {
    this.name = process.env.APP_NAME ?? "MyApp"
    this.env = process.env.NODE_ENV as NodeEnv
    this.origin = {
      api: process.env.API_ORIGIN!,
      client: process.env.CLIENT_ORIGIN!,
    }
    this.isProduction = process.env.NODE_ENV === "production"
    this.isDevelopment = process.env.NODE_ENV === "development"
  }
}
let instance: AppConfig | null = null

export const config = () => {
  if (!instance) {
    instance = new AppConfig()
  }
  return instance
}
