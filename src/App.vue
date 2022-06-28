<template>
  <dialog-template v-if="isOpen" />
  <notifications position="bottom right" close-on-click />
  <router-view />
</template>

<script setup lang="ts">
import dialogTemplate from '~/components/core/dialog-template.vue'
import { isOpen } from '~/components/core/dialog-manager'

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'SouSou',
  meta: [
    { name: 'description', content: 'Spill the tea!' },
  ],
})
</script>
