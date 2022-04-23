<template>
  <!-- GROUPS -->
  <div
    class="flex flex-col items-center no-wrap gap-y-2 py-2 pl-2 h-full"
  >
    <div
      v-if="groups.length"
      v-for="(group, index) in groups" :key="group.id"
      class="flex flex-row items-center no-wrap gap-x-2 p-2 justify-center bg-gray-300 rounded-md h-18 w-full"
      :class="props.miniState ? 'justify-center' : 'justify-start'"
      :md="props.miniState ? 'justify-center h-18' : 'justify-start h-20'"
      dark="bg-dark-base-3"
    >
      <!-- GROUP-IMAGE -->
      <div
        class="rounded-full w-12 h-12 bg-blue-200 flex items-center justify-center text-gray-700 text-2xl font-bold"
        md="w-14 h-14"
      >
        G{{ index }}
      </div>
      <div
        v-if="!props.miniState"
        class="flex flex-col no-wrap hidden"
        md="block"
      >
        <div>{{ group.name }}</div>
        <div>tag</div>
        <div>something else</div>
      </div>
    </div>
    <div
      v-else
      class="text-lg h-full w-full flex items-start"
    >
      <div
        class="chip bg-dark-base-3 w-full"
      >
        No groups 😓
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// stores
import { useGroups } from '~/stores/groups';

const props = defineProps({
  miniState: Boolean,
})

const groupStore = useGroups()

// todo: temporary
onMounted(async () => await groupStore.fetchUsersGroups())

const groups = computed(() => groupStore.groups)

</script>
