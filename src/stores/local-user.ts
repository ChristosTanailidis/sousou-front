/* eslint-disable camelcase */
import { defineStore } from 'pinia'
import { api } from '~/boot/axios'

// interfaces
import type { GraphQLResponse } from '~/assets/entities/axios-response'
import type { UserInputData, UserLoginInputData } from '~/assets/input-data/user'
import type User from '~/assets/entities/user'

// graphql
import { qCreateUser, qLoginUser } from '~/assets/gql/mutations/user'

interface AuthUser {
  id: string
  displayName: string
  email: string
}

export const useLocalUser = defineStore({
  id: 'localUser',
  state: () => {
    const user: AuthUser = {
      id: '',
      displayName: '',
      email: '',
    }

    const loading = 0

    return {
      user,
      loading,
    }
  },
  getters: {
    //
  },
  actions: {
    async loginUser(user: UserLoginInputData) {
      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(qLoginUser),
            variables: {
              data: {
                ...user,
              },
            },
          },
        }) as unknown as GraphQLResponse<User>

        // todo: add notify
        if (response.data.data)
          this.user = response.data.data as AuthUser
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
            query: print(qCreateUser),
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
          return null
        }
      }
      catch (e) {
        console.log(e)
      }
      finally {
        this.loading--
      }
    },
  },
})
