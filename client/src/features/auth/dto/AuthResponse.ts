import type { AuthUser } from "#types/auth.types"

export interface AuthResponseDto {
  user: AuthUser
  message: string
}
export interface LogoutResponseDto {
  message: string
}
