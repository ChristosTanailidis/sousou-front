<template>
  <div
    class="flex flex-nowrap items-center gap-4 h-[80px] border-b-2 border-primary"
  >
    <div>
      <q-avatar
        class="h-[78px] w-[78px]"
        square
      >
        <UserImage
          :user="friend"
          text-size="4rem"
        />
      </q-avatar>
    </div>

    <div class="text-xl font-semibold self-start my-1">
      <div class="flex flex-col gap-2 justify-center">
        <div
          :class="[
            'flex flex-nowrap gap-1',
            disabled && 'text-[rgba(255,255,255,0.3)]'
          ]"
        >
          <div v-if="disabled">
            <q-icon name="block" />
          </div>

          <div>
            {{ friend.displayName }}
          </div>

          <div class="font-thin">
            #{{ friend.code }}
          </div>
        </div>
      </div>
    </div>

    <q-space />

    <div class="flex no-wrap gap-1 my-1 mr-5">
      <q-btn
        flat
        round
        unelevated
        icon="phone_in_talk"
        color="primary"
        :disable="disabled"
        @click="initiateCall(personalChatId)"
      />

      <q-btn
        flat
        round
        unelevated
        icon="more_horiz"
        :disable="disabled"
      >
        <q-menu class="shadow-none border border-[1px] rounded border-[rgba(255,255,255,0.2)]">
          <q-list style="min-width: 100px">
            <q-item
              v-close-popup
              clickable
              class="hover:text-negative"
              @click="removeFriend()"
            >
              <q-item-section class="leading-4 text-[1rem] w-[7rem]">
                Remove friend
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

// components
import UserImage from '../reusables/UserImage.vue'

// models
import { User } from 'src/models/User'

// stores
import { useCallStore } from 'stores/call-store'
import { useUsersStore } from 'stores/users/index'
import { useAuthUser } from 'src/stores/auth-user'
import { storeToRefs } from 'pinia'

// utils

export default defineComponent({
  components: { UserImage },
  props: {
    friend: {
      type: Object as PropType<User>,
      required: true
    },
    personalChatId: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const callStore = useCallStore()
    const { initiateCall } = callStore

    const usersStore = useUsersStore()
    const userStore = useAuthUser()

    const { user } = storeToRefs(userStore)

    const removeFriend = () => {
      usersStore.removeFriend(props.friend.id)

      const removeIndex = user.value?.personalChats.findIndex(pc => pc.id === props.personalChatId)

      if (user.value && removeIndex && removeIndex >= 0) {
        Object.assign(user.value?.personalChats[removeIndex], { disabled: true })
      }
    }

    return {
      initiateCall,
      removeFriend
    }
  }
})
</script>
