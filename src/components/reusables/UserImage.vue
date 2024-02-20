<template>
  <div
    v-if="user"
    class="h-full w-full bg-primary relative"
  >
    <div
      v-if="disabled"
      class="absolute w-full h-full top-0 right-0 z-50 bg-[rgba(0,0,0,0.8)]"
    />

    <q-img
      v-if="user.icon"
      :src="user.icon"
      fit="cover"
      class="h-full w-full "
      :spinner-size="textSize"
    >
      <template #error>
        <div
          class="h-full w-full flex items-center justify-center uppercase "
          :style="{ fontSize: textSize }"
        >
          {{ user.displayName?.charAt(0) }}
        </div>
      </template>
    </q-img>

    <div
      v-else
      class="w-full h-full flex items-center justify-center uppercase"
      :style="{ fontSize: textSize }"
    >
      {{ user.displayName?.charAt(0) }}
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
      default: undefined
    },
    textSize: {
      type: String,
      default: '2rem'
    },
    disabled: {
      type: Boolean,
      default: false
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
