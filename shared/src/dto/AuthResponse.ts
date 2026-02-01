import { AuthUser } from "../lib/AuthUser"

export type AuthResponseDto = {
  user: AuthUser
  message: string
}
