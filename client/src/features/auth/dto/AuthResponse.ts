import type { AuthUser } from "@auth/types"

export interface AuthResponseDto {
  user: AuthUser
  message: string
}
export interface LogoutResponseDto {
  message: string
}
