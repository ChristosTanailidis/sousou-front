/* eslint-disable camelcase */
import { defineStore } from 'pinia'
import { print } from 'graphql'
import { api } from '~/boot/axios'

// interfaces
import type Group from '~/assets/entities/group'
import type GroupInputData from '~/assets/entities/input-data/group'
import type { GraphQLResponse } from '~/assets/entities/axios-response'
import type { GroupPagination } from '~/assets/entities/pagination/group'

// graphql
import { mCreateGroup } from '~/assets/gql/mutations/group'
import { qGetGroups } from '~/assets/gql/queries/groups'

// utils
import notify, { notifyRequestErrors } from '~/utils/notify'

export const useGroups = defineStore({
  id: 'groups',
  state: () => {
    const groups = [] as Group[]
    const total = 0
    const pagination = undefined as GroupPagination | undefined
    const loading = 0

    return {
      groups,
      total,
      pagination,
      loading,
    }
  },
  getters: {
    //
  },
  actions: {
    async createGroup(group: GroupInputData) {
      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(mCreateGroup),
            variables: {
              data: {
                ...group,
              },
            },
          },
        }) as unknown as GraphQLResponse<{ created: boolean }>

        if (response.data.data && !!response.data.data.created) {
          notify('success', `Group ${group.name} created successfully`)

          await this.fetchUsersGroups()

          return true
        }
        else {
          console.log('create group error', response.data.errors)
          notifyRequestErrors(response.data.errors)
          return undefined
        }
      }
      catch (e) {
        console.log(e)
        return undefined
      }
      finally {
        this.loading--
      }
    },

    async fetchUsersGroups() {
      try {
        this.loading++
        const response = await api({
          url: '',
          method: 'post',
          data: {
            query: print(qGetGroups),
            variables: {
              paginationInputData: this.pagination 
                ? { ...this.pagination } 
                : { limit: 0, page: 1 }, // fetch all
            },
          },
        }) as unknown as GraphQLResponse<{ groups: { data: Array<Group>, total: number } }>

        if (response.data.data) {
          this.groups = response.data.data.groups.data
          this.total = response.data.data.groups.total
          return response.data.data.groups
        }
        else {
          console.log('fetch groups error', response.data.errors)
          notifyRequestErrors(response.data.errors)
          return undefined
        }
      }
      catch (e) {
        console.log(e)
        return undefined
      }
      finally {
        this.loading--
      }
    }
  },
})
