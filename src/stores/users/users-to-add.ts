import { defineStore } from 'pinia'
import Request from '../graphql-request'

// models
import { UserPaginationData } from 'src/models/PaginationData'
import { UserToAdd } from 'src/models/User'

// gql
import { qGetUsersToAdd } from 'src/graphql/users/queries'

export const useAddUsersStore = defineStore('users-to-add-store', {
  state: () => ({
    users: undefined as undefined | UserToAdd[],
    total: 0,
    loading: false
  }),

  actions: {
    async fetch (paginatedData: UserPaginationData) {
      this.loading = true
      return await Request(qGetUsersToAdd, { paginatedData })
        .then((response) => {
          const res = (response as { getAvailableUsersToAdd: { data: UserToAdd[], total: number} }).getAvailableUsersToAdd
          this.users = res.data
          this.total = res.total
          return this.users
        })
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    }
  }
})
