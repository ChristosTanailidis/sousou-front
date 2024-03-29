import { AuthUser } from 'src/models/AuthUser'
import jwtDecode from 'jwt-decode'

export const Auth = () => {
  // Default threshold value of 2 minutes
  const tokenState = (threshold = 2 * 60 * 1000) => {
    const token = localStorage.getItem('sousou_token')
    if (!token) {
      return {
        hasToken: false,
        isValid: false,
        isOverThreshold: false,
        diff: -1,
        token
      }
    } else {
      const authUser = jwtDecode(token) as AuthUser
      const expiresAt = authUser.exp * 1000
      const now = Math.floor(new Date().getTime())

      const diff = expiresAt - now

      return {
        hasToken: !!token,
        isValid: (diff > 0),
        isOverThreshold: (diff > threshold),
        diff,
        token
      }
    }
  }

  return {
    tokenState
  }
}
