<template>
  <div
    class="dialog"
    @click.self="isOpen = !isOpen"
  >
    <div
      class="dialog-container"
    >
      <component :is="childComponent" v-bind="childProps" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { childComponent, childProps, isOpen } from '~/components/core/dialog-manager'

onMounted(() => {
  console.log('i ran')
})
</script>
