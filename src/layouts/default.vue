<template>
  <main
    class="h-full overflow-hidden text-gray-700"
    dark="text-dark-content-1 bg-dark-base-1"
  >
    <div
      class="flex flex-row no-wrap p-4 h-full"
    >
      <div class="flex flex-row no-wrap">
        <!-- DRAWER -->
        <div
          class="flex flex-col no-wrap gap-y-4 w-24"
          :md="miniState ? 'w-24' : 'w-72'"
        >
          <div class="flex flex-col no-wrap gap-y-1">
            <!-- USER INFO -->
            <div
              class="flex flex-row justify-start no-wrap items-center gap-x-4 p-2
                  bg-gray-200 rounded-t-md rounded-l-md rounded-r-md h-24"
              dark="bg-dark-base-2"
              :md="miniState ? '' : 'rounded-r-none rounded-t-md'"
            >
              <img
                src="https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
                class="rounded-full w-20 h-20"
              >
              <div
                v-if="!miniState"
                class="flex flex-col no-wrap items-center hidden"
                md="block"
              >
                <div>name</div>
                <div>tag</div>
                <div>something else</div>
              </div>
            </div>

            <!-- USER SETTINGS AND OPTIONS -->
            <div
              class="flex flex-row justify-end no-wrap items-center gap-x-4 p-2 self-center bg-gray-200 rounded-b-md"
              dark="bg-dark-base-2"
              :md="miniState ? 'self-center' : 'self-end'"
            >
              <button
                class="flex items-center rounded bg-gray-400 p-1"
                dark="bg-dark-base-3 text-dark-content-1"
                hover="opacity-80"
              >
                <carbon-settings />
              </button>
              <button
                class="flex items-center just rounded bg-gray-400 p-1"
                dark="bg-red-500 text-dark-content-1"
                hover="opacity-80"
              >
                <carbon-logout />
              </button>
            </div>
          </div>

          <!-- GROUPS -->
          <div
            class="flex flex-col items-center no-wrap gap-y-2 py-2 pl-2 bg-gray-200 rounded-md h-full overflow-y-scroll"
            dark="bg-dark-base-2"
          >
            <div
              v-for="i in 15" :key="i"
              class="flex flex-row items-center no-wrap gap-x-2 p-2 justify-center bg-gray-300 rounded-md h-18 w-full"
              :class="miniState ? 'justify-center' : 'justify-start'"
              :md="miniState ? 'justify-center h-18' : 'justify-start h-20'"
              dark="bg-dark-base-3"
            >
              <!-- GROUP-IMAGE -->
              <div
                class="rounded-full w-12 h-12 bg-blue-200 flex items-center justify-center text-gray-700 text-2xl font-bold"
                md="w-14 h-14"
              >
                G{{ i }}
              </div>
              <div
                v-if="!miniState"
                class="flex flex-col no-wrap hidden"
                md="block"
              >
                <div>name</div>
                <div>tag</div>
                <div>something else</div>
              </div>
            </div>
          </div>
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
import { ref } from 'vue'

const miniState = ref(false)
</script>
