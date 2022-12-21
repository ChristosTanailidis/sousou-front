<template>
  <div
    class="flex flex-nowrap items-center gap-4 h-[80px] border-b-2 border-primary"
  >
    <div>
      <q-avatar
        class="h-[78px] w-[78px]"
        square
      >
        <q-img
          v-if="friend.icon"
          :src="friend.icon"
          fit="cover"
          class="h-full w-full bg-primary"
        />

        <div
          v-else
          class="bg-primary text-[2em] w-full h-full flex items-center justify-center"
        >
          {{ friend.displayName.charAt(0) }}
        </div>
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
import { User } from 'src/models/User'

// components

// models

// stores

// utils

export default defineComponent({
  props: {
    friend: {
      type: Object as PropType<User>,
      required: true
    }
  },
  setup () {
    return {

    }
  }
})
</script>
