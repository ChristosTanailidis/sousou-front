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

      <div
        class="grid grid-cols-10 h-full"
      >
        <SideBar
          :header-ref="headerRef"
          :group="group"
        />
        <div class="col-span-8 bg-dark-200">
          <router-view :style="{ height: 'calc(100vh - 100px)' }" />
        </div>
      </div>
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
import SideBar from 'src/components/group-page/side-bar/SideBar.vue'
import GroupHeader from 'src/components/group-page/GroupHeader.vue'

// models

// stores
import { useGroupsStore } from 'src/stores/groups'

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
