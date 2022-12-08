import { defineStore } from 'pinia'
import Request from '../graphql-request'

// models
import { LoginUser, RegisterUser, UpdateUserData } from 'src/models/InputData'
import { User } from 'src/models/User'

// gql
import { mRegisterUser, mLoginUser, mLogoutUser, mRefreshToken, mConfirmEmail, mResendEmailConfirmation, mUpdateUser } from 'src/graphql/auth-user/mutations'
import { qCheckUsernameAvailability, qGetLoggedUser } from 'src/graphql/auth-user/queries'
import { AxiosError } from 'axios'

export const useAuthUser = defineStore('auth-user', {
  state: () => ({
    user: undefined as undefined | User,
    loading: false
  }),
  actions: {
    async register (data: RegisterUser) {
      this.loading = true
      return await Request(mRegisterUser, { data })
        .then((response) => (response as { registerUser: string }).registerUser)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    async login (data: LoginUser) {
      this.loading = true
      return await Request(mLoginUser, { data })
        .then(async (response) => {
          const token = (response as { loginUser: string }).loginUser

          if (!token) { return undefined }

          localStorage.setItem('sousou_token', token)

          const loggedUser = await fetchLoggedUser()

          if (!loggedUser) { return undefined }

          this.user = { ...loggedUser, jwtToken: token }

          return token
        })
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    async logout () {
      this.loading = true
      return Request(mLogoutUser)
        .then((response) => {
          const loggedOut = (response as { logoutUser: boolean }).logoutUser
          if (!loggedOut) {
            return undefined
          }

          localStorage.removeItem('sousou_token')
          this.user = undefined
          return loggedOut
        })
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    async refreshToken () {
      this.loading = true
      return Request(mRefreshToken)
        .then(async (response) => {
          const token = (response as { refreshToken: string }).refreshToken

          if (!token) {
            return undefined
          }

          localStorage.setItem('sousou_token', token)

          const loggedUser = await fetchLoggedUser()

          if (loggedUser) {
            return undefined
          }

          this.user = loggedUser

          return token
        })
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    async confirmEmail (token: string) {
      this.loading = true
      return Request(mConfirmEmail, { confirmEmailToken: token })
        .then((response) => {
          return (response as { confirmEmailToken: boolean }).confirmEmailToken
        })
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    async resendConfirmation (email: string) {
      this.loading = true
      return Request(mResendEmailConfirmation, { email })
        .then((response) => {
          return (response as { resendEmailConfirmation: string }).resendEmailConfirmation
        })
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    async fetchUser () {
      try {
        this.user = await fetchLoggedUser()
        return this.user
      } catch (err) {
        return undefined
      }
    },

    async updateUser (data: UpdateUserData) {
      this.loading = true
      return await Request(mUpdateUser, { data })
        .then((response) => (response as { updateUser: boolean }).updateUser)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    async checkUsernameAvailability (username: string) {
      this.loading = true
      return await Request(qCheckUsernameAvailability, { username })
        .then((response) => (response as { usernameExists: boolean }).usernameExists)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    }
  }
})

export const fetchLoggedUser = async () => {
  const loggedUser = await Request(qGetLoggedUser)
    .then((res) => (res as {user: User}).user)
    .catch((ex) => { throw new Error(ex) })
  return loggedUser
}
