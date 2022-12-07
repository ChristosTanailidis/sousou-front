import { defineStore } from 'pinia'
import Request from '../graphql-request'

// models
import { UserPaginationData } from 'src/models/PaginationData'
import { User } from 'src/models/User'

// gql
import { qGetUsersToInvite } from 'src/graphql/users/queries'

export const useInviteUsersStore = defineStore('users-store', {
  state: () => ({
    users: undefined as undefined | User[],
    total: 0,
    loading: false
  }),
  actions: {
    async fetch (paginatedData: UserPaginationData, groupId: string) {
      this.loading = true
      return await Request(qGetUsersToInvite, { paginatedData, groupId })
        .then((response) => {
          const res = (response as { getAvailableUsersToInvite: { data: User[], total: number} }).getAvailableUsersToInvite
          this.users = res.data
          this.total = res.total
          return this.users
        })
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    }
  }
})
