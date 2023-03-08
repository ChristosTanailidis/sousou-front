<template>
  <div
    class="h-full w-full"
    :style="{ backgroundColor: group.color || 'var(--q-primary)'}"
  >
    <q-img
      v-if="group.icon"
      :src="group.icon"
      fit="cover"
      class="h-full w-full "
    >
      <template #error>
        <div
          class="h-full w-full flex items-center justify-center uppercase "
          :style="{ fontSize: textSize }"
        >
          {{ group.name.charAt(0) }}
        </div>
      </template>
    </q-img>

    <div
      v-else
      class="w-full h-full flex items-center justify-center uppercase"
      :style="{ fontSize: textSize }"
    >
      {{ group.name.charAt(0) }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

// components

// models
import { Group } from 'src/models/Group'

// stores

// utils

export default defineComponent({
  props: {
    group: {
      type: Object as PropType<Group>,
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
