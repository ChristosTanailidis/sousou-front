import { defineStore } from 'pinia'

export const useCallStore = defineStore('call-store', {
  state: () => ({
    initiateCall: false,
    personalChatId: undefined as string | undefined,
    callType: undefined as 'caller' | 'receiver' | undefined
  }),
  actions: {
  }
})
