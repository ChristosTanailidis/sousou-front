<template>
  <div class="h-full w-full bg-primary">
    <q-img
      v-if="user.icon"
      :src="user.icon"
      fit="cover"
      class="h-full w-full "
    >
      <template #error>
        <div
          class="h-full w-full flex items-center justify-center uppercase "
          :style="{ fontSize: textSize }"
        >
          {{ user.displayName.charAt(0) }}
        </div>
      </template>
    </q-img>

    <div
      v-else
      class="w-full h-full flex items-center justify-center uppercase"
      :style="{ fontSize: textSize }"
    >
      {{ user.displayName.charAt(0) }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

// components

// models
import { User } from 'src/models/User'

// stores

// utils

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    },
    textSize: {
      type: String,
      default: '2rem'
    }
  },
  setup () {
    return {

    }
  }
})
</script>

<style>
.q-img__content > div {
  padding: 0px !important;
  background-color: transparent;
}
</style>
