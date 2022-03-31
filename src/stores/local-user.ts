/* eslint-disable camelcase */
import { defineStore } from 'pinia'
import type { UserInputData, UserLoginInputData } from '~/assets/input-data/user'
import { useUserMutation } from '~/hooks/mutations/user'

// export interface AuthUser {
//   sub: string
//   azp: string
//   resource_access: { global_roles: string[] }
//   scope: string
//   email: string
//   name: string
//   preferred_username: string
// }

export const useLocalUser = defineStore({
  id: 'localUser',
  state: () => {
    const id = ''
    const displayName = ''
    const email = ''

    return {
      id,
      displayName,
      email,
    }
  },
  getters: {
    // user: (state) => {
    //   return state
    // },
  },
  actions: {
    async loginUser(userData: UserLoginInputData) {
      const { logUser } = useUserMutation()

      const result = await logUser(userData)

      return result
    },
    async createUser(userData: UserInputData) {
      const { addUser } = useUserMutation()

      const result = await addUser(userData)

      return result // todo: this will become boolean
    },
  },
})
