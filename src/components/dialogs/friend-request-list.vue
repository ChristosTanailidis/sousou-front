<template>
  <div
    v-if="props.value" class="dialog"
    @click.self="emits('update:value', false)"
  >
    <div
      class="dialog-container"
    >
      <!-- Friend Request Item -->
      {{ friendRequests }}
      <div
        v-for="fr in friendRequests?.data"
        :key="fr.id"
      >
        <pre>
          {{ fr }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// interfaces

import { storeToRefs } from 'pinia'
import { useUsers } from '~/stores/users'

// stores

const emits = defineEmits(['update:value'])

const props = defineProps({
  value: Boolean,
})

const usersStore = useUsers()

onMounted(async() => {
  console.log('fetching...')
  await usersStore.fetchFriendRequests()
})

const { friendRequests } = storeToRefs(usersStore)

</script>
