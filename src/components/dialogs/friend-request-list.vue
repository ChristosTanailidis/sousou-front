<template>
  <div
    v-if="props.value" class="dialog"
    @click.self="emits('update:value', false)"
  >
    <div
      class="dialog-container"
    >
      Work in progress
      <!-- Friend Request Item -->
      <div
        v-for="fr in friendRequests"
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

import { useUsers } from '~/stores/users'

// stores

const emits = defineEmits(['update:value'])

const props = defineProps({
  value: Boolean,
})

const usersStore = useUsers()

const { friendRequests } = usersStore

</script>
