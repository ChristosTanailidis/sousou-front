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
          <TextContainer
            :personal-chat-id="personalChatId"
            :friend="friend"
          />
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
import TextContainer from 'src/components/friend-page/containers/TextContainer.vue'

// models

// stores
import { useAuthUser } from 'src/stores/auth-user'
import FriendHeader from 'src/components/friend-page/FriendHeader.vue'

// utils

export default defineComponent({
  components: { TextContainer, FriendHeader },
  props: {
    personalChatId: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const userStore = useAuthUser()
    const { user } = storeToRefs(userStore)

    const friend = computed(() => {
      const pc = user.value?.personalChats

      return pc?.find(p => p.personalChat.id === props.personalChatId)?.users[0]
    })
    return {
      settingsMenu: ref(false),
      headerRef: ref(),

      friend
    }
  }
})

</script>
