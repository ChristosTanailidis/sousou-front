/* eslint-disable camelcase */
import { defineStore } from 'pinia'
import jwt_decode from 'jwt-decode'
import { print } from 'graphql'
import { api } from '~/boot/axios'
import { router } from '~/router'

// interfaces
import type { GraphQLResponse } from '~/assets/entities/axios-response'
import type { UserInputData, UserLoginInputData } from '~/assets/entities/input-data/user'
import type User from '~/assets/entities/user'

// graphql
import { mCreateUser, mLoginUser, mLogoutUser } from '~/assets/gql/mutations/user'
import { qGetLoggedUser, qGetUserByID } from '~/assets/gql/queries/user'

// utils
import notify from '~/utils/notify'

interface DecodedToken {
  id: string
  email: string
  username: string
  displayName: string
  icon: string
  preferences: JSON
  code: number
  iat: number // issued at
  exp: number // expiration time
}

export const useLocalUser = defineStore({
  id: 'localUser',
  state: () => {
    const user = undefined as User | undefined
    const token = undefined as string | undefined

    const loading = 0

    return {
      user,
      token,
      loading,
    }
  },
  getters: {
    decodedToken(state) {
      const localToken = localStorage.getItem('token')

      if (localToken) this.token = localToken

      if (!state.token) return undefined

      return jwt_decode(state.token) as DecodedToken
    },
  },
  actions: {
    async loginUser(user: UserLoginInputData) {
      // this.userInputData = user

      const token = await this.getUserToken(user)
      if (!token) return

      localStorage.setItem('token', token)
      this.token = token

      const loggedUser = await this.getLoggedUser()

      if (!loggedUser) return
      this.user = { ...loggedUser, token }

      router.push('/')

      return token && loggedUser
    },

    async logoutUser() {
      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(mLogoutUser),
          },
        }) as unknown as GraphQLResponse<{ loggedOut: boolean }>

        if (response.data.data && !!response.data.data.loggedOut) {
          localStorage.removeItem('token')

          this.user = undefined
          this.token = undefined

          if (router.currentRoute.value.path !== '/logout')
            router.push('/logout')

          notify('success', 'Successfully logged out')

          return response.data.data.loggedOut
        }
        else {
          console.log('logout user error')
          return undefined
        }
      }
      catch (e) {
        return undefined
      }
      finally {
        this.loading--
      }
    },

    async getUserToken(user: UserLoginInputData) {
      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(mLoginUser),
            variables: {
              data: {
                ...user,
              },
            },
          },
        }) as unknown as GraphQLResponse<{ token: string }>

        if (response.data.data) {
          return response.data.data.token
        }
        else {
          console.log('login user error')
          return undefined
        }
      }
      catch (e) {
        return undefined
      }
      finally {
        this.loading--
      }
    },

    async createUser(user: UserInputData) {
      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(mCreateUser),
            variables: {
              data: {
                ...user,
              },
            },
          },
        }) as unknown as GraphQLResponse<{ registerUser: boolean }>

        if (response.data.data) {
          notify('success', 'User Created', 'Email verification is required')

          router.push('/confirm-email')

          return response.data.data.registerUser
        }
        else {
          console.log('register user error')
          return undefined
        }
      }
      catch (e) {
        return undefined
      }
      finally {
        this.loading--
      }
    },

    async getLoggedUser() {
      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(qGetLoggedUser),
          },
        }) as unknown as GraphQLResponse<{ user: User }>

        if (response.data.data) {
          return response.data.data.user
        }
        else {
          console.log('get logged user error')
          return undefined
        }
      }
      catch (e) {
        return undefined
      }
      finally {
        this.loading--
      }
    },

    async getUserByID(userID: string) {
      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(qGetUserByID),
            variables: {
              getUserByIdId: userID,
            },
          },
        }) as unknown as GraphQLResponse<{ user: User }>

        if (response.data.data) {
          return response.data.data.user
        }
        else {
          console.log('get user by id error')
          return undefined
        }
      }
      catch (e) {
        return undefined
      }
      finally {
        this.loading--
      }
    },
  },
})
