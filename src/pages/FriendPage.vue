<template>
  <div
    class="rounded overflow-hidden h-full bg-dark-500"
  >
    <div
      v-if="friend"
      class="flex flex-col flex-nowrap h-full"
    >
      <div ref="headerRef">
        <FriendHeader
          :friend="friend"
          :personal-chat-id="personalChatId"
          :disabled="isDisabled"
        />
      </div>

      <div
        class="h-full"
      >
        <div class="bg-dark-200">
          <TextContainer
            :key="personalChatId"
            :personal-chat-id="personalChatId"
            :friend="friend"
            :disabled="isDisabled"
            :style="{ height: 'calc(100vh - 100px)' }"
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
import FriendHeader from 'src/components/friend-page/FriendHeader.vue'

// models

// stores
import { useAuthUser } from 'src/stores/auth-user'

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

      return pc?.find(pc => pc.id === props.personalChatId)?.users[0]
    })

    const isDisabled = computed(() => {
      const pc = user.value?.personalChats

      return pc?.find(pc => pc.id === props.personalChatId)?.disabled
    })

    return {
      settingsMenu: ref(false),
      headerRef: ref(),

      isDisabled,
      friend

    }
  }
})

</script>
