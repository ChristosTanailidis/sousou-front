<template>
  <div class="flex flex-col gap-y-1">
    <!-- TODO: Make this a component -->
    <!-- USER INFO -->
    <div
      v-if="user"
      class="flex flex-row justify-start items-center gap-4 p-2 bg-secondary min-h-[100px] rounded"
    >
      <img
        v-if="!user.icon"
        src="https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg"
        class="rounded-full w-[90px] object-cover border-1 border-primary shadow-md"
      >
      <div
        v-else
        class="rounded-full w-[90px] object-cover"
      >
        {{ user.icon }}
      </div>

      <div
        class="flex flex-col gap-1 justify-between flex-grow h-full"
      >
        <div class="text-xl">
          {{ user.username }}
        </div>

        <div class="font-thin">
          {{ user.displayName }}#{{ user.code }}
        </div>

        <div
          class="flex flex-row items-center gap-x-2 self-end my-1 px-2"
        >
          <div
            class="btn w-full"
            @click="openDialog(CreateGroupDialog)"
          >
            <carbon-add-alt />
          </div>
          <div
            class="btn w-full"
            @click="openDialog(AddFriendDialog)"
          >
            <carbon-face-add />
          </div>
          <button
            class="btn"
          >
            <carbon-settings />
          </button>

          <!-- .btn-logout class -->
          <router-link
            class="btn bg-red-500"
            :to="'/logout'"
          >
            <carbon-logout />
          </router-link>
        </div>

        <loading-bar
          :percentage="tokenTimeLeft"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { openDialog } from '../core/dialog-manager'

// component
import LoadingBar from '../common/loading-bar.vue'
import CreateGroupDialog from '../forms/group.vue'
import AddFriendDialog from '../forms/add-friend.vue'

// stores
import { useLocalUser } from '~/stores/local-user'

const localUserStore = useLocalUser()

const { user } = localUserStore

const tokenTimeLeft = ref(0)

const tokenExpirationLimit = 60 * 60 * 1000 // 1h

// todo: fix this
const timeLeft = () => {
  if (!localUserStore.decodedToken) {
    tokenTimeLeft.value = -1
    return
  }

  const exp = localUserStore.decodedToken.exp * 1000

  const diff = exp - Date.now()

  tokenTimeLeft.value = parseInt((diff / tokenExpirationLimit * 100).toFixed(0))
}

onMounted(() => {
  if (tokenTimeLeft.value >= 0)
    setInterval(timeLeft, 1000)
})

</script>
