import { print } from 'graphql'
import { api } from '~/boot/axios'
import type { GraphQLResponse } from '~/assets/entities/axios-response'

import { createUser, loginUser } from '~/assets/gql/mutations/user'
import type { UserInputData, UserLoginInputData } from '~/assets/input-data/user'
import type User from '~/assets/entities/user'

export function useUserMutation() {
  const addUser = async(user: UserInputData) => {
    try {
      const response = await api({
        url: '',
        method: 'post',
        data: {
          query: print(createUser),
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
  }

  const logUser = async(user: UserLoginInputData) => {
    try {
      const response = await api({
        url: '',
        method: 'post',
        data: {
          query: print(loginUser),
          variables: {
            data: {
              ...user,
            },
          },
        },
      }) as unknown as GraphQLResponse<boolean> // todo: change this to boolean returning value

      // todo: add notify
      if (response.data.data) {
        return response.data.data
      }
      else {
        console.log('login user error', response.data.errors)
        return null
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  return {
    addUser,
    logUser,
  }
}
