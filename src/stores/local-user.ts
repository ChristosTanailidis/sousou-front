/* eslint-disable camelcase */
import { defineStore } from 'pinia'
import type UserInputData from '~/assets/input-data/user'
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
    // addUser(userLogged: AuthUser) {
    //   this.$patch({
    //     id: userLogged.sub,
    //     name: userLogged.name,
    //     email: userLogged.email,
    //     role: userLogged.resource_access.global_roles[0],
    //   })
    // },
    // removeUser() {
    //   this.$reset()
    // },
    async createUser(userData: UserInputData) {
      const { addUser } = useUserMutation()

      const result = await addUser(userData)

      return result // todo: this will become boolean
    },
  },
})
