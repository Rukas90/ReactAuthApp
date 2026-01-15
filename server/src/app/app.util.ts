type NodeEnv = "production" | "development"

export const appConfig = {
  env: process.env.NODE_ENV as NodeEnv,

  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",

  name: process.env.APP_NAME ?? "MyApp",
}
