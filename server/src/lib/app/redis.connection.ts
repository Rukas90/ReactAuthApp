import IORedis from "ioredis"

const CONNECTION = new IORedis("redis://localhost:6379")

const redis = {
  initialize: () => {
    CONNECTION.on("connect", () => {
      console.log("Redis connected")
    })

    CONNECTION.on("ready", () => {
      console.log("Redis ready")
    })

    CONNECTION.on("error", (err) => {
      console.error("Redis error:", err)
    })

    CONNECTION.on("close", () => {
      console.log("Redis closed")
    })
  },
  connection: CONNECTION,
}
export default redis
