/* eslint-disable camelcase */
import { defineStore } from 'pinia'
import jwt_decode from 'jwt-decode'
import { print } from 'graphql'
import { api } from '~/boot/axios'

// interfaces
import type { GraphQLResponse } from '~/assets/entities/axios-response'
import type { UserInputData, UserLoginInputData } from '~/assets/input-data/user'
import type User from '~/assets/entities/user'

// graphql
import { mCreateUser, mLoginUser, mLogoutUser } from '~/assets/gql/mutations/user'
import { qGetUserByID } from '~/assets/gql/queries/user'

export const useLocalUser = defineStore({
  id: 'localUser',
  state: () => {
    const user = undefined as User | undefined
    const token = undefined as string | undefined
    const userInputData = undefined as UserLoginInputData | undefined

    const loading = 0

    return {
      user,
      token,
      userInputData,
      loading,
    }
  },
  getters: {
    decodedToken(state) {
      if (!state.token) return undefined
      return jwt_decode(state.token)
    }
  },
  actions: {
    async loginUser(user: UserLoginInputData) {
      this.userInputData = user

      this.token = await this.getUserToken()
      if (!this.token) {
        // notify: token was not returned
        return
      }

      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(qGetUserByID),
            variables: {
              id: this.decodedToken.id,
            },
          },
        }) as unknown as GraphQLResponse<{ user: User }>

        // todo: add notify
        if (response.data.data){
          this.user = { ...response.data.data.user, token: this.token }
          localStorage.setItem('token', this.token)

          return response.data.data.user
        }
        else{
          console.log('login user error', response.data.errors)
          return undefined
        }
      }
      catch (e) {
        console.log(e)
        return undefined
      }
      finally {
        this.loading--
      }
    },

    async logoutUser() {
      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(mLogoutUser)
          },
        }) as unknown as GraphQLResponse<{ loggedOut: boolean}>

        // todo: add notify
        if (response.data.data && response.data.data.loggedOut){
          this.user = undefined
          this.token = undefined
          this.userInputData = undefined

          localStorage.removeItem('token')

          return response.data.data.loggedOut
        }
        else{
          console.log('logout user error', response.data.errors)
          return undefined
        }
      }
      catch (e) {
        console.log(e)
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

        // todo: add notify
        if (response.data.data) {
          return response.data.data.registerUser
        }
        else {
          console.log('register user error', response.data.errors)
          return undefined
        }
      }
      catch (e) {
        console.log(e)
        return undefined
      }
      finally {
        this.loading--
      }
    },

    async getUserToken() {
      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(mLoginUser),
            variables: {
              data: {
                ...this.userInputData,
              },
            },
          },
        }) as unknown as GraphQLResponse<{ token: string }>

        // todo: add notify
        if (response.data.data) {
          return response.data.data.token
        }
        else {
          console.log('login user error', response.data.errors)
          return undefined
        }
      }
      catch (e) {
        console.log(e)
        return undefined
      }
      finally {
        this.loading--
      }
    },
  },
})
