<template>
  <!-- GROUPS -->
  <div
    class="flex flex-col items-center no-wrap gap-y-2 py-2 pl-2 h-full"
  >
    <group-list-item
      v-for="group in groups"
      :key="group.id"
      :value="group"
      :mini-state="props.miniState"
    />
    <div
      v-if="!groups.length"
      class="text-lg h-full w-full flex items-start"
    >
      <div class="chip bg-dark-base-3 w-full">
        No groups 😓
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// components
import GroupListItem from '~/components/list-items/group-list-item.vue'

// stores
import { useGroups } from '~/stores/groups'

const props = defineProps({
  miniState: Boolean,
})

const groupStore = useGroups()

// todo: temporary
onMounted(async() => await groupStore.fetchUsersGroups())

const groups = computed(() => groupStore.groups)

</script>
