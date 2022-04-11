<template>
  <div
    v-if="props.value" class="dialog"
    @click.self="emits('update:value', false)"
  >
    <div
      class="dialog-container"
    >
      add a friend
    </div>
  </div>
</template>

<script setup lang="ts">
// interfaces

// stores

const emits = defineEmits(['update:value'])

const props = defineProps({
  value: Boolean,
})
</script>
