import { defineStore } from 'pinia'
import Request from '../graphql-request'

// models
import { GroupPaginationData } from 'src/models/PaginationData'
import { GroupInputData, GroupInviteData, TextChannelInputData, VoiceChannelInputData } from 'src/models/InputData'
import { Group } from 'src/models/Group'

// gql
import { mCancelGroupInvite, mCreateGroup, mCreateGroupInvite, mUpdateGroup } from 'src/graphql/groups/mutations'
import { mCreateTextChannel, mCreateVoiceChannel } from 'src/graphql/channels/mutations'
import { qGetGroupById, qGetGroups } from 'src/graphql/groups/queries'

export default defineStore('group-store', {
  state: () => ({
    groups: undefined as undefined | Group[],
    group: undefined as undefined | Group,
    total: 0,
    loading: false
  }),
  actions: {
    // CRUD
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

    async fetchGroup (getGroupByIdId: string) {
      this.loading = true
      return await Request(qGetGroupById, { getGroupByIdId })
        .then((response) => {
          const res = (response as { getGroupById: Group }).getGroupById
          this.group = res
          return this.group
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
    },

    // Group Invites
    async inviteUser (data: GroupInviteData) {
      this.loading = true
      return await Request(mCreateGroupInvite, { data })
        .then((response) => (response as { createGroupInvite: boolean }).createGroupInvite)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    async cancelInvite (cancelGroupInviteId: string) {
      this.loading = true
      return await Request(mCancelGroupInvite, { cancelGroupInviteId })
        .then((response) => (response as { cancelGroupInvite: boolean }).cancelGroupInvite)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    // Channel Related
    async createTextChannel (data: TextChannelInputData) {
      this.loading = true
      return await Request(mCreateTextChannel, { data })
        .then((response) => (response as { createTextChannel: boolean }).createTextChannel)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    async createVoiceChannel (data: VoiceChannelInputData) {
      this.loading = true
      return await Request(mCreateVoiceChannel, { data })
        .then((response) => (response as { createTextChannel: boolean }).createTextChannel)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    }
  }
})
