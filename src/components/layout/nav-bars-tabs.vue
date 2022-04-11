<template>
  <div class="flex flex-col">
    <div
      class="flex flex-row no-wrap"
    >
      <!-- #TABS -->
      <div
        class="flex flex-row no-wrap gap-x-2 bg-dark-base-2 rounded-t-md p-2"
      >
        <div v-for="(tab, index) in tabs" :key="tab">
          <div
            class="btn"
            @click="selectedTab = index"
          >
            {{ tab }}
          </div>
        </div>
      </div>

      <!-- #CREATE-GROUP / #ADD-FRIEND -->
      <div
        class="flex gap-x-2 items-center justify-end w-full p-2"
      >
        <div
          class="btn w-full"
          @click="flags.createGroup = true"
        >
          <carbon-add-alt />
        </div>
        <div
          class="btn w-full"
          @click="flags.addFriend = true"
        >
          <carbon-face-add />
        </div>
      </div>
    </div>

    <div
      class="bg-dark-base-2 rounded-b-md rounded-r-md flex-grow overflow-y-scroll"
    >
      <!-- #GROUPS -->
      <div v-if="selectedTab === 0">
        <group-list :mini-state="props.miniState" />
      </div>

      <!-- #FRIENDS -->
      <div v-else-if="selectedTab === 1">
        <friend-list :mini-state="props.miniState" />
      </div>
    </div>

    <!-- #DIALOGS -->
    <!-- #CREATE-GROUP-DIALOG -->
    <create-group-dialog v-model:value="flags.createGroup" />
    <add-friend-dialog v-model:value="flags.addFriend" />
  </div>
</template>

<script setup lang="ts">
import CreateGroupDialog from '../dialogs/group.vue'
import AddFriendDialog from '../dialogs/add-friend.vue'

import GroupList from './tabs/group-list.vue'
import FriendList from './tabs/friend-list.vue'

const props = defineProps({
  miniState: Boolean,
})

const tabs = ['Groups', 'Friends']
const selectedTab = ref(0)

const flags = ref({
  createGroup: false,
  addFriend: false,
})

</script>
