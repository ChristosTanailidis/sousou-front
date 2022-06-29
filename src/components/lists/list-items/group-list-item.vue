<template>
  <div
    class="group-list-item justify-start"
  >
    <div
      class="h-full w-[13%] object-fill object-center text-center"
      :style="`background-color: ${group.color}`"
    >
      <!-- todo: this will become the src of an img -->
      <div>
        {{ group.icon }}
      </div>
    </div>

    <div
      class="text-lg font-semibold flex-grow"
    >
      {{ group.name }}
    </div>

    <div
      :style="`background-color: ${group.color}`"
      class="h-full w-[10px]"
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

// interfaces
import type Group from '~/assets/entities/group'

// components

// stores

// utils

// const emits = defineEmits([])

const props = defineProps({
  value: {
    type: Object as PropType<Group>,
    required: true,
  },
})

const group = computed((): Group => props.value)

</script>
