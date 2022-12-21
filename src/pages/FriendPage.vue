<template>
  <div
    class="rounded overflow-hidden h-full bg-dark-500"
  >
    <div
      v-if="friend"
      class="flex flex-col flex-nowrap h-full"
    >
      <div ref="headerRef">
        <FriendHeader :friend="friend" />
      </div>

      <div
        class="grid grid-cols-10 h-full"
      >
        <div class="col-span-10 bg-dark-200">
          <router-view />
        </div>
      </div>
    </div>
    <div
      v-else
      class="h-full w-full flex items-center justify-center"
    >
      No such friend. Sorry!
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

// components
import FriendHeader from 'src/components/friend-page/FriendHeader.vue'

// models

// stores
import { useAuthUser } from 'src/stores/auth-user'

// utils

export default defineComponent({
  components: { FriendHeader },
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  emits: [],
  setup (props) {
    const userStore = useAuthUser()

    const { user } = storeToRefs(userStore)

    const friend = computed(() => {
      return user.value?.friendList.find(u => u.id === props.userId)
    })

    // watch(() => props.type, async () => {
    //   await groupsStore.fetchGroup(props.type)
    // }, { immediate: true })

    return {
      friend,
      settingsMenu: ref(false),
      headerRef: ref()
    }
  }
})

</script>
