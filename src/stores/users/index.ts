import { defineStore } from 'pinia'
import Request from '../graphql-request'

// models
import { FriendRequestInputData } from 'src/models/InputData'
import { PaginationData, UserPaginationData } from 'src/models/PaginationData'
import { User } from 'src/models/User'

// gql
import { qGetUsers } from 'src/graphql/users/queries'
import { mAnswerFriendRequest, mCancelFriendRequest, mCreateFriendRequest, mRemoveFriend } from 'src/graphql/users/mutations'
import { qGetPersonalMessages } from 'src/graphql/messages/queries'
import { PersonalMessage } from 'src/models/PersonalMessage'
import { PaginatedData } from 'src/models/PaginatedData'

export const useUsersStore = defineStore('users-store', {
  state: () => ({
    users: undefined as undefined | User[],
    total: 0,
    loading: false
  }),
  actions: {
    async fetch (paginatedData: UserPaginationData) {
      this.loading = true
      return await Request(qGetUsers, { paginatedData })
        .then((response) => {
          const res = (response as { getUsers: { data: User[], total: number} }).getUsers
          this.users = res.data
          this.total = res.total
          return this.users
        })
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    async fetchPersonalMessages (paginationInputData: PaginationData, personalChatId: string) {
      this.loading = true
      return await Request(qGetPersonalMessages, { paginationInputData, personalChatId })
        .then((response) => (response as { getPersonalMessages: PaginatedData<PersonalMessage> }).getPersonalMessages)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    // async fetchUser (getGroupByIdId: string) {
    //   this.loading = true
    //   return await Request(qGetGroupById, { getGroupByIdId })
    //     .then((response) => {
    //       const res = (response as { getGroupById: Group }).getGroupById
    //       this.group = res
    //       return this.group
    //     })
    //     .catch(() => undefined)
    //     .finally(() => { this.loading = false })
    // },

    async createFriendRequest (data: FriendRequestInputData) {
      this.loading = true
      return await Request(mCreateFriendRequest, { data })
        .then((response) => (response as { createFriendRequest: boolean }).createFriendRequest)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    async cancelFriendRequest (cancelFriendRequestId: string) {
      this.loading = true
      return await Request(mCancelFriendRequest, { cancelFriendRequestId })
        .then((response) => (response as { cancelFriendRequest: boolean }).cancelFriendRequest)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    async answerFriendRequest (answer: boolean, answerFriendRequestId: string) {
      this.loading = true
      return await Request(mAnswerFriendRequest, { answer, answerFriendRequestId })
        .then((response) => (response as { answerFriendRequest: boolean }).answerFriendRequest)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    },

    async removeFriend (deleteFriendId: string) {
      this.loading = true
      return await Request(mRemoveFriend, { deleteFriendId })
        .then((response) => (response as { deleteFriend: boolean }).deleteFriend)
        .catch(() => undefined)
        .finally(() => { this.loading = false })
    }
  }
})
