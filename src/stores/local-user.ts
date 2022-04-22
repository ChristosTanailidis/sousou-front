/* eslint-disable camelcase */
import { defineStore } from 'pinia'
import jwt_decode from 'jwt-decode'
import { print } from 'graphql'
import { api } from '~/boot/axios'

// interfaces
import type { GraphQLResponse } from '~/assets/entities/axios-response'
import type { UserInputData, UserLoginInputData } from '~/assets/entities/input-data/user'
import type User from '~/assets/entities/user'

// graphql
import { mCreateUser, mLoginUser, mLogoutUser } from '~/assets/gql/mutations/user'
import { qGetUserByID } from '~/assets/gql/queries/user'
import notify, { notifyRequestErrors } from '~/utils/notify'

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
      if (!state.token) return undefined
      return jwt_decode(state.token)
    }
  },
  actions: {
    async loginUser(user: UserLoginInputData) {
      // this.userInputData = user

      const token = await this.getUserToken(user)
      if (!token) return

      this.token = token

      const loggedUser = await this.getUserByID(this.decodedToken.id)
      if (!loggedUser) return

      this.user = { ...loggedUser, token }
      
      localStorage.setItem('token', token)

      return token && loggedUser
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

        if (response.data.data && !!response.data.data.loggedOut){
          this.user = undefined
          this.token = undefined

          localStorage.removeItem('token')

          notify('success', 'Successfully logged out')
          return response.data.data.loggedOut
        }
        else{
          console.log('logout user error', response.data.errors)
          notifyRequestErrors(response.data.errors)
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
          console.log('login user error', response.data.errors)
          notifyRequestErrors(response.data.errors)
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

        if (response.data.data) {
          notify('success', 'User Created', 'Email verification is required')
          return response.data.data.registerUser
        }
        else {
          console.log('register user error', response.data.errors)
          notifyRequestErrors(response.data.errors)
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

    async getUserByID(userID: string) {
      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(qGetUserByID),
            variables: {
              getUserByIdId: userID
            },
          },
        }) as unknown as GraphQLResponse<{ user: User }>

        if (response.data.data){
          return response.data.data.user
        }
        else {
          console.log('get user by id error', response.data.errors)
          notifyRequestErrors(response.data.errors)
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
