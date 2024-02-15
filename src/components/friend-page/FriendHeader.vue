<template>
  <div
    class="flex flex-nowrap items-center gap-4 h-[80px] border-b-2 border-primary"
  >
    <div>
      <q-avatar
        class="h-[78px] w-[78px]"
        square
      >
        <UserImage
          :user="friend"
          text-size="4rem"
        />
      </q-avatar>
    </div>

    <div class="text-xl font-semibold self-start my-1">
      <div class="flex flex-col gap-2 justify-center">
        <div class="flex flex-nowrap gap-1">
          <div>
            {{ friend.displayName }}
          </div>

          <div class="font-thin">
            #{{ friend.code }}
          </div>
        </div>
      </div>
    </div>

    <q-space />

    <div class="flex no-wrap gap-1 my-1 mr-5">
      <q-btn
        flat
        round
        unelevated
        icon="phone_in_talk"
        color="primary"
        @click="initiateCall(personalChatId)"
      />
      <q-btn
        flat
        round
        unelevated
        icon="settings"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

// components
import UserImage from '../reusables/UserImage.vue'

// models
import { User } from 'src/models/User'

// stores
import { useCallStore } from 'stores/call-store'

// utils

export default defineComponent({
  components: { UserImage },
  props: {
    friend: {
      type: Object as PropType<User>,
      required: true
    },
    personalChatId: {
      type: String,
      required: true
    }
  },
  setup () {
    const callStore = useCallStore()
    const { initiateCall } = callStore

    return {
      initiateCall
    }
  }
})
</script>
