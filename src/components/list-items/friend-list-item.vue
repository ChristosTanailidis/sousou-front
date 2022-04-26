<template>
  <div
    class="group-list-item justify-center"
  >
    <div
      class="avatar-rounded bg-gray-500"
    >
      <!-- todo: this will become the src of an img -->
      <div>
        {{ friend.icon }}
      </div>
    </div>
    <div
      v-if="!props.miniState"
      class="text-lg font-bold flex-grow hidden"
      md="block"
    >
      {{ friend.displayName }} - {{ friend.code }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

// interfaces
import type User from '~/assets/entities/user'

// components

// stores

// utils

// const emits = defineEmits([])

const props = defineProps({
  value: {
    type: Object as PropType<User>,
    required: true,
  },
  miniState: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const friend = computed((): User => props.value)

</script>
