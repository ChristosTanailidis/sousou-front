<template>
  <div class="flex flex-col no-wrap gap-y-1">
    <!-- TODO: Make this a component -->
    <!-- USER INFO -->
    <div
      class="flex flex-row justify-start no-wrap items-center gap-x-4 p-2
                  bg-gray-200 rounded-t-md rounded-l-md rounded-r-md h-24"
      dark="bg-dark-base-2"
      :md="props.miniState ? '' : 'rounded-r-none rounded-t-md'"
    >
      <img
        v-if="!user.icon || !user.icon.length"
        src="https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
        class="rounded-full w-20 h-20"
      >
      <div
        v-else
        class="rounded-full w-20 h-20"
      >
        {{ user.icon }}
      </div>
      <div
        v-if="!props.miniState"
        class="flex flex-col no-wrap items-center hidden"
        md="block"
      >
        <div class="text-xl">
          {{ user.username }}
        </div>
        <div class="font-thin">
          {{ user.displayName }} (#{{ user.code }})
        </div>
        <div>
          {{ tokenTimeLeft }}
        </div>
      </div>
    </div>

    <!-- USER SETTINGS AND OPTIONS -->
    <div
      class="flex flex-row justify-end no-wrap items-center gap-x-4 p-2 self-center bg-gray-200 rounded-b-md"
      dark="bg-dark-base-2"
      :md="props.miniState ? 'self-center' : 'self-end'"
    >
      <button
        class="flex items-center rounded bg-gray-400 p-1"
        dark="bg-dark-base-3 text-dark-content-1"
        hover="opacity-80"
      >
        <carbon-settings />
      </button>
      <router-link
        class="flex items-center just rounded bg-gray-400 p-1"
        dark="bg-red-500 text-dark-content-1"
        hover="opacity-80"
        :to="'/logout'"
      >
        <carbon-logout />
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'

// stores
import { useLocalUser } from '~/stores/local-user'

const localUserStore = useLocalUser()

const { user } = localUserStore

const tokenTimeLeft = ref('0')

// todo: fix this
const timeLeft = () => {
  if (!localUserStore.decodedToken) {
    tokenTimeLeft.value = 'ERROR'
    return
  }

  const exp = localUserStore.decodedToken?.exp * 1000

  tokenTimeLeft.value = moment(exp - Date.now()).format('hh:mm:ss')
}

onMounted(() => setInterval(timeLeft, 1000))

const props = defineProps({
  miniState: Boolean,
})
</script>
