<template>
  <div class="flex flex-col bg-secondary rounded overflow-hidden">
    <!-- #TABS -->
    <div
      class="flex flex-row w-full"
    >
      <div
        v-for="tab in Object.keys(tabs)" :key="tab"
        class="tab"
        :class="selectedTab === tab ? 'tab-selected' : 'tab'"
        @click="selectedTab = (tab as Tabs)"
      >
        {{ tab }}
      </div>
    </div>

    <div
      class="flex-grow overflow-scroll"
    >
      <component :is="selectedComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

// components
import GroupList from '../lists/group-list.vue'
import FriendList from '../lists/friend-list.vue'

type Tabs = 'groups' | 'friends'
const tabs = {
  groups: GroupList as Component,
  friends: FriendList as Component,
}

const selectedTab = ref<Tabs>('groups')
const selectedComponent = computed(() => tabs[selectedTab.value] ? tabs[selectedTab.value] : GroupList)

</script>
