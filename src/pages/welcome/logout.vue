<template>
  <div>
    You are being logged out...
  </div>
</template>

<script setup lang="ts">
import { useLocalUser } from '~/stores/local-user'

onMounted(async() => {
  if (localStorage.getItem('token'))
    await useLocalUser().logoutUser()
})
</script>

<route lang="yaml">
alias: /logout
meta:
  layout: welcome
</route>
