<template>
  <!-- GROUPS -->
  <div
    class="flex flex-col items-center gap-y-2 py-2 mx-2"
  >
    <div
      class="btn chip w-full flex justify-center"
    >
      <!-- todo -->
      Create Group
    </div>
    <group-list-item
      v-for="group in groups"
      :key="group.id"
      :value="group"
      class="h-[43px]"
    />
    <div
      v-if="!groups || !groups.length"
      class="text-lg w-full flex items-start"
    >
      <div class="chip h-[43px] bg-secondary w-full">
        No groups 😓
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// components
import GroupListItem from '~/components/lists/list-items/group-list-item.vue'

// stores
import { useGroups } from '~/stores/groups'

const groupStore = useGroups()

// todo: temporary
onMounted(async() => await groupStore.fetchUsersGroups())

const groups = computed(() => groupStore.groups)

</script>
