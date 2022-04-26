<template>
  <main
    class="h-screen overflow-hidden text-gray-700"
    dark="text-dark-content-1 bg-dark-base-1"
  >
    <div
      class="flex flex-row no-wrap p-4 h-full"
    >
      <div class="flex flex-row no-wrap h-full">
        <!-- DRAWER -->
        <div
          class="flex flex-col no-wrap gap-y-4 w-24 h-full"
          :md="miniState ? 'w-24' : 'w-72'"
        >
          <!-- #Logged User Info -->
          <local-user-info />

          <!-- #Groups / #Friends -->
          <nav-bars-tabs :mini-state="miniState" class="h-full overflow-y-hidden overflow-x-visible" />
        </div>

        <!-- CLOSE-OPEN BUTTON -->
        <div class="flex h-full items-center">
          <button
            class="h-full flex items-center invisible"
            md="visible"
            @click="miniState = !miniState"
          >
            <carbon-chevron-right v-if="miniState" />
            <carbon-chevron-left v-else />
          </button>
        </div>
      </div>
      <!-- MAIN ROUTE -->
      <div
        class="flex flex-grow bg-gray-200 rounded-md"
        dark="bg-dark-base-2"
      >
        <router-view />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
// components
import NavBarsTabs from '~/components/layout/nav-bars-tabs.vue'
import LocalUserInfo from '~/components/layout/local-user-info.vue'

const miniState = ref(false)

</script>
