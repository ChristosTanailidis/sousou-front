<template>
  <div
    class="rounded overflow-hidden h-full bg-dark-500"
  >
    <div
      v-if="group"
      class="flex flex-col flex-nowrap h-full"
    >
      <div ref="headerRef">
        <GroupHeader :group="group" />
      </div>

      <SideBar
        :header-ref="headerRef"
        :group="group"
      />
    </div>
    <div
      v-else
      class="h-full w-full flex items-center justify-center"
    >
      No Group Sorry!
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// components
import SideBar from 'src/components/group-page-components/SideBar.vue'

// models

// stores
import useGroupsStore from 'src/stores/groups'
import GroupHeader from 'src/components/group-page-components/GroupHeader.vue'

// utils

export default defineComponent({
  components: { SideBar, GroupHeader },
  props: {
    groupId: {
      type: String,
      required: true
    }
  },
  emits: [],
  setup (props) {
    const groupsStore = useGroupsStore()

    const { group } = storeToRefs(groupsStore)

    watch(() => props.groupId, async () => {
      await groupsStore.fetchGroup(props.groupId)
    }, { immediate: true })

    return {
      group,

      settingsMenu: ref(false),
      headerRef: ref()
    }
  }
})

</script>
