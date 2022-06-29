<template>
  <main
    class="h-screen bg-base text-context overflow-hidden"
  >
    <div
      class="grid grid-cols-10 gap-4 p-3 h-full"
    >
      <div
        class="col-span-2 rounded flex flex-col gap-2 h-full overflow-hidden"
      >
        <local-user-info />

        <navbar-tabs class="flex-grow" />
      </div>

      <div
        class="col-span-8 bg-secondary rounded h-full"
      >
        <router-view />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
// components
import NavbarTabs from '~/components/layout/navbar-tabs.vue'
import LocalUserInfo from '~/components/layout/local-user-info.vue'

</script>
