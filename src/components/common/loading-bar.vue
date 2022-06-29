<template>
  <div
    class="w-full bg-black bg-opacity-20 transition-all rounded-lg"
    :class="props.percentage < props.breakPoint ? 'animate-pulse' : ''"
  >
    <div
      class="h-1 rounded transition-all"
      :style="`width: ${props.percentage}%;`"
      :class="`${props.percentage < props.breakPoint ? 'bg-red-500' : 'bg-primary'}`"
    />
  </div>
</template>

<script setup lang="ts">
// interfaces

// components

// stores

// utils

// const emits = defineEmits([])

const props = defineProps({
  percentage: {
    type: Number,
    default: 100,
  },
  breakPoint: {
    type: Number,
    default: 20,
  },
})

</script>
