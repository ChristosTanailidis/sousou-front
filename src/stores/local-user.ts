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
    //
  },
  actions: {
<<<<<<< HEAD
    async loginUser(userData: UserLoginInputData) {
      const { logUser } = useUserMutation()

      const result = await logUser(userData)

      return result
    },
=======
>>>>>>> 32778a5ee8956062f6c3bc92d78415f5c3926e23
    async createUser(userData: UserInputData) {
      const { addUser } = useUserMutation()

      return await addUser(userData)
    },
  },
})
