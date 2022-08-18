export interface AuthUser {
  code: string
  displayName: string
  email: string
  exp: number
  iat: number
  icon: string
  id: string
  preferences: JSON
  username: string
}
