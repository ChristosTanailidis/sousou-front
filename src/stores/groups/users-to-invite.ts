import { defineStore } from 'pinia'
import Request from '../graphql-request'

// models
import { UserPaginationData } from 'src/models/PaginationData'
import { User } from 'src/models/User'

// gql
import { qGetUsers } from 'src/graphql/users/queries'

export default defineStore('users-store', {
  state: () => ({
    users: undefined as undefined | User[],
    total: 0,
    loading: false
  }),
  actions: {
    async fetch (paginatedData: UserPaginationData) {
      this.loading = true
      // todo: na allaksei to query sto GetAvailableUsersToInvite
      return await Request(qGetUsers, { paginatedData })
        .then((response) => {
          const res = (response as { getUsers: { data: User[], total: number} }).getUsers
          this.users = res.data
          this.total = res.total
          return this.users
        })
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    }
  }
})
