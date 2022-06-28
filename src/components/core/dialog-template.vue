<template>
  <div
    class="fixed top-0 left-0 h-screen w-screen z-[99]"
    style="background-color: rgba(0, 0, 0, 0.25);"
    @click="isOpen = !isOpen"
  >
    <div
      class="w-full h-full flex items-center justify-center"
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
