/* eslint-disable camelcase */
import { defineStore } from 'pinia'
import { print } from 'graphql'
import { api } from '~/boot/axios'

// interfaces
import type User from '~/assets/entities/user'
import type FriendRequestInputData from '~/assets/entities/input-data/friend-request'
import type FriendRequest from '~/assets/entities/friend-request'
import type { UserPagination } from '~/assets/entities/pagination/users'

// graphql
import type { GraphQLResponse } from '~/assets/entities/axios-response'
import { qGetFriendRequests, qGetFriends, qGetUsers } from '~/assets/gql/queries/user'
import { mCreateFriendRequest } from '~/assets/gql/mutations/user'

// utils
import notify from '~/utils/notify'

export const useUsers = defineStore({
  id: 'users',
  state: () => {
    const users = undefined as { data: User[]; total: number } | undefined
    const friends = undefined as User[] | undefined

    const friendRequests = undefined as { data: FriendRequest[]; total: number } | undefined

    const pagination = ref<UserPagination | undefined>()
    const loading = 0

    return {
      users,
      friends,
      friendRequests,

      pagination,
      loading,
    }
  },
  getters: {
    //
  },
  actions: {
    /* QUERIES */
    async fetchUsers() {
      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(qGetUsers),
            variables: {
              paginatedData: this.pagination
                ? { ...this.pagination }
                : { limit: 0, page: 1 }, // fetch all
            },
          },
        }) as unknown as GraphQLResponse<{ users: { data: User[]; total: number } }>

        if (response.data.data) {
          this.users = response.data.data.users
          return this.users
        }
        else {
          console.log('fetch users error')
          return undefined
        }
      }
      catch (e) {
        return undefined
      }
      finally {
        this.loading--
      }
    },

    async fetchFriends() { // todo: fetches all friends in the app
      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(qGetFriends),
            variables: {
              paginatedData: this.pagination
                ? { ...this.pagination }
                : { limit: 0, page: 1 }, // fetch all
            },
          },
        }) as unknown as GraphQLResponse<{ users: { data: { friends: Array<User> }[]; total: number } }>

        if (response.data.data) {
          // todo: temporary!! waiting for back fetch friends query
          this.friends = []
          response.data.data.users.data.forEach((data) => {
            data.friends.forEach((friend) => {
              if (!this.friends)
                this.friends = []

              this.friends.push(friend)
            })
          })
          return this.friends
        }
        else {
          console.log('fetch friends error')
          return undefined
        }
      }
      catch (e) {
        return undefined
      }
      finally {
        this.loading--
      }
    },

    // todo: waiting for fetchFriendRequest implementation from api
    async fetchFriendRequests() {
      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(qGetFriendRequests),
            variables: {
              forMe: true,
              paginatedData: this.pagination
                ? { ...this.pagination }
                : { limit: 0, page: 1 }, // fetch all
            },
          },
        }) as unknown as GraphQLResponse<{ friendRequests: { data: Array<FriendRequest>; total: number } }>

        if (response.data.data) {
          this.friendRequests = response.data.data.friendRequests
          return response.data.data.friendRequests.data
        }
        else {
          console.log('fetch friends error')
          return undefined
        }
      }
      catch (e) {
        return undefined
      }
      finally {
        this.loading--
      }
    },

    /* MUTATIONS */
    async createFriendRequest(friendRequest: FriendRequestInputData) {
      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(mCreateFriendRequest),
            variables: {
              data: {
                ...friendRequest,
              },
            },
          },
        }) as unknown as GraphQLResponse<{ created: boolean }>

        if (response.data.data && !!response.data.data.created) {
          notify('success', 'Friend request sent successfully')

          // todo: fetch here the friend requests?

          return true
        }
        else {
          console.log('create group error')
          return undefined
        }
      }
      catch (e) {
        return undefined
      }
      finally {
        this.loading--
      }
    },
  },
})
