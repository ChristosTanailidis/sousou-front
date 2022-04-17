/* eslint-disable camelcase */
import { defineStore } from 'pinia'
import { print } from 'graphql'
import { api } from '~/boot/axios'

// interfaces
import type Group from '~/assets/entities/group'
import type { GroupInputData } from '~/assets/input-data/group'
import type { GraphQLResponse } from '~/assets/entities/axios-response'

// graphql
import { mCreateGroup } from '~/assets/gql/mutations/group'

export const useGroups = defineStore({
  id: 'groups',
  state: () => {
    const groups: Group[] = []

    const loading = 0

    return {
      groups,
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
        }) as unknown as GraphQLResponse<{ registerUser: boolean }>

        // todo: add notify
        if (response.data.data) {
          return response.data.data.registerUser
        }
        else {
          console.log('create group error', response.data.errors)
          return null
        }
      }
      catch (e) {
        console.log(e)
      }
      finally {
        this.loading--
      }
    },
  },
})
