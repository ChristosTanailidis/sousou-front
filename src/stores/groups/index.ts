import { defineStore } from 'pinia'
import Request from '../graphql-request'

// models
import { GroupInputData, GroupInviteData, TextChannelInputData, VoiceChannelInputData } from 'src/models/InputData'
import { GroupPaginationData, PaginationData } from 'src/models/PaginationData'
import { TextChannelMessage } from 'src/models/TextChannelMessage'
import { PaginatedData } from 'src/models/PaginatedData'
import { VoiceChannel } from 'src/models/VoiceChannel'
import { TextChannel } from 'src/models/TextChannel'
import { Group } from 'src/models/Group'

// gql
import { mAnswerGroupInvite, mCancelGroupInvite, mCreateGroup, mCreateGroupInvite, mUpdateGroup } from 'src/graphql/groups/mutations'
import { mCreateVoiceChannel } from 'src/graphql/channels/voice-channels/mutations'
import { mCreateTextChannel } from 'src/graphql/channels/text-channels/mutations'
import { qFetchVoiceChannel } from 'src/graphql/channels/voice-channels/queries'
import { qFetchTextChannel } from 'src/graphql/channels/text-channels/queries'
import { qGetGroupChannelMessages } from 'src/graphql/messages/queries'
import { qGetGroupById, qGetGroups } from 'src/graphql/groups/queries'

export const useGroupsStore = defineStore('group-store', {
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

    async answerInvite (answer: boolean, answerGroupInviteId: string) {
      this.loading = true
      return await Request(mAnswerGroupInvite, { answer, answerGroupInviteId })
        .then((response) => (response as { cancelGroupInvite: boolean }).cancelGroupInvite)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    // Channel Related
    async fetchTextChannel (getTextChannelByIdId: string) {
      this.loading = true
      return await Request(qFetchTextChannel, { getTextChannelByIdId })
        .then((response) => (response as { getTextChannelById: TextChannel }).getTextChannelById)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    async fetchVoiceChannel (getVoiceChannelByIdId: string) {
      this.loading = true
      return await Request(qFetchVoiceChannel, { getVoiceChannelByIdId })
        .then((response) => (response as { getVoiceChannelById: VoiceChannel }).getVoiceChannelById)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

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
    },

    async fetchGroupChannelMessages (paginationInputData: PaginationData, getPaginatedTextChannelMessagesByTextChannelIdId: string) {
      this.loading = true
      return await Request(qGetGroupChannelMessages, { paginationInputData, getPaginatedTextChannelMessagesByTextChannelIdId })
        .then((response) => (response as { getChannelMessages: PaginatedData<TextChannelMessage> }).getChannelMessages)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    }
  }
})
