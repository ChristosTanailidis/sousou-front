import { print } from 'graphql'
import { api } from '~/boot/axios'
import type { GraphQLResponse } from '~/assets/entities/axios-response'

import { createUser } from '~/assets/gql/mutations/user'
import type UserInputData from '~/assets/input-data/user'
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

  return {
    addUser,
  }
}
