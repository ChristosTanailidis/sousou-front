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
import { mCreateUser, mLoginUser } from '~/assets/gql/mutations/user'
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
    //
  },
  actions: {
    async loginUser(user: UserLoginInputData) {
      this.userInputData = user

      this.token = await this.getUserToken()
      if (!this.token) {
        // notify: token was not returned
        console.log('No token')
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
              id: (jwt_decode(this.token) as User).id,
            },
          },
        }) as unknown as GraphQLResponse<{ user: User }>

        // todo: add notify
        if (response.data.data){
          this.user = { ...response.data.data.user, token: this.token }
          // todo: redirect to home
          // useRouter().push({path:"/",name:"index"})
        }
        else
          console.log('login user error', response.data.errors)
      }
      catch (e) {
        console.log(e)
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
