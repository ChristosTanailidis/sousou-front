import { defineStore } from 'pinia'
import Request from '../graphql-request'

// models
import { GroupPaginationData } from 'src/models/PaginationData'
import { GroupInputData } from 'src/models/InputData'
import { Group } from 'src/models/Group'

// gql
import { mCreateGroup, mUpdateGroup } from 'src/graphql/groups/mutations'
import { qGetGroups } from 'src/graphql/groups/queries'

export default defineStore('group-store', {
  state: () => ({
    groups: undefined as undefined | Group[],
    total: 0,
    loading: false
  }),
  actions: {
    async fetch (paginationInputData: GroupPaginationData) {
      this.loading = true
      return await Request(qGetGroups, { paginationInputData })
        .then((response) => {
          const res = (response as { getGroups: { data: Group[], total: number} }).getGroups
          this.groups = res.data
          this.total = res.total
          return this.groups
        })
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },
    async createGroup (data: GroupInputData) {
      this.loading = true
      return await Request(mCreateGroup, { data })
        .then((response) => (response as { createGroup: boolean }).createGroup)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },
    async updateGroup (updateGroupId: string, data: GroupInputData) {
      this.loading = true
      return await Request(mUpdateGroup, { data, updateGroupId })
        .then((response) => (response as { updateGroup: boolean }).updateGroup)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    }
  }
})
