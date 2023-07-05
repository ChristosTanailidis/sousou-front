<template>
  <div class="p-2 bg-[rgba(0,0,0,0.2)] rounded-[0.4rem] shadow flex flex-col items-center justify-center max-w-[50%] min-w-[20%]">
    <div class="flex flex-row items-center justify-start w-full ">
      <div class="w-[4rem] flex justify-center">
        <q-icon
          size="2rem"
          :name="message.callData?.answer ? message.from.id === user?.id ? 'call_made' : 'call_received' : message.from.id === user?.id ? 'call_missed_outgoing' : 'call_missed' "
          :color="message.callData?.answer ? '' : 'negative'"
          class="bg-[rgba(255,255,255,0.2)] p-2 rounded-full"
        />
      </div>
      <div class="flex flex-col flex-grow items-center">
        <div
          class="flex flex-row items-center gap-1 font-thin"
        >
          <div v-if="message.from.id === user?.id">
            You made a call
          </div>
          <div v-else>
            {{ message.from?.displayName }} called you
          </div>
          <div v-if="message.callData?.startTimestamp">
            {{ formatDistanceToNow(new Date(message.callData?.startTimestamp)) }} ago
          </div>
          <div v-else-if="message.createdAt">
            {{ formatDistanceToNow(new Date(message.createdAt)) }} ago
          </div>
        </div>

        <div
          v-if="message.callData?.answer && message.callData?.startTimestamp && message.callData?.endTimestamp"
          class="text-semibold"
        >
          In call for {{ formatDistance(new Date(message.callData.startTimestamp), new Date(message.callData.endTimestamp)) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatDistance, formatDistanceToNow } from 'date-fns'
import { storeToRefs } from 'pinia'
import { PersonalMessage } from 'src/models/PersonalMessage'
import { useAuthUser } from 'src/stores/auth-user'
import { PropType, defineComponent } from 'vue'

// components

// models

// stores

// utils

export default defineComponent({
  components: {},
  props: {
    message: {
      type: Object as PropType<PersonalMessage>,
      required: true
    }
  },
  emits: [],
  setup () {
    const userStore = useAuthUser()
    const { user } = storeToRefs(userStore)
    return {
      user,
      formatDistance,
      formatDistanceToNow
    }
  }
})
</script>
