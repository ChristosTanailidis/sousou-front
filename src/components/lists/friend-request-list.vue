<template>
  <!-- Friend Request Item -->
  <div
    v-for="fr in friendRequests?.data"
    :key="fr.id"
  >
    <pre>
      {{ fr }}
    </pre>
  </div>
</template>

<script setup lang="ts">
// interfaces

import { storeToRefs } from 'pinia'
import { useUsers } from '~/stores/users'

const usersStore = useUsers()

onMounted(async() => {
  await usersStore.fetchFriendRequests()
})

const { friendRequests } = storeToRefs(usersStore)

</script>
