<template>
  <q-list
    class="rounded relative "
  >
    <q-item class="flex flex-col gap-2 p-2 sticky top-0 left-0 bg-dark-500 z-50">
      <q-btn
        flat
        no-caps
        color="primary"
        icon="add"
        label="Add a friend"
        class="w-full"
        @click="openAddFriend"
      />
      <q-input
        v-model="search"
        dense
        borderless
        rounded
        debounce="750"
        type="search"
        placeholder="Search in your friend list"
        class="w-full bg-dark-50 rounded px-2"
      >
        <template #append>
          <q-icon
            name="search"
            color="primary"
          />
        </template>
      </q-input>
    </q-item>

    <!-- Friend -->
    <router-link
      v-for="personalChat in personalChatsFiltered"
      :key="personalChat.id"
      :to="'/friend/' + personalChat.id"
    >
      <UserItem
        :user="personalChat.users[0]"
        :sub-text="personalChat.latestMessage || personalChat.messages[0]?.text"
        :notify="personalChat.newMessagesNumber"
        :disabled="personalChat.disabled"
        class="mx-2"
      />
    </router-link>
  </q-list>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'

// components
import AddFriends from './dialogs/user/AddFriends.vue'
import UserItem from './reusables/UserItem.vue'

// models

// stores
import { useAuthUser } from 'src/stores/auth-user'
import { socket } from 'src/boot/socket_io'
import { PersonalMessage } from 'src/models/PersonalMessage'
import { LastReadMessagePivot } from 'src/models/SocketData'
import { useRouter } from 'vue-router'

// utils

export default defineComponent({
  components: { UserItem },
  props: {},
  emits: [],
  setup () {
    const userStore = useAuthUser()
    const { user, personalChats } = storeToRefs(userStore)

    const notificationSound = new Audio('/sounds/Notification.mp3')

    const search = ref('')

    const personalChatsFiltered = computed(() => {
      if (!personalChats) {
        return []
      }

      if (!search.value.length || search.value.charAt(0) === ' ') {
        return personalChats.value
      }

      return personalChats.value.filter(
        (pc) =>
          pc.users[0].code.toLowerCase()?.includes(search.value.toLowerCase()) || /* Search by code */
          ('#' + pc.users[0].code).toLowerCase()?.includes(search.value.toLowerCase()) || /* Search by {#}code */
          pc.users[0].displayName.toLowerCase()?.includes(search.value.toLowerCase()) /* Search by displayed name */
      )
    })

    const $q = useQuasar()

    const openAddFriend = () => {
      $q.dialog({
        component: AddFriends
      }).onOk(async () => {
        await userStore.fetchUser()
      })
    }

    const router = useRouter()

    onMounted(() => {
      socket.on('message-receive', (message: PersonalMessage) => {
        if (message.from.id === user.value?.id) {
          return
        }

        const pcIndex = personalChats.value.findIndex(pc => pc.id === message.personalChat?.id)

        if (pcIndex < 0) {
          return
        }

        personalChats.value[pcIndex].latestMessage = message.text

        if (router.currentRoute.value.params) {
          const { personalChatId } = router.currentRoute.value.params
          if (personalChatId && personalChatId !== message.personalChat.id) {
            notificationSound.pause()
            notificationSound.currentTime = 0
            notificationSound.play()
            const nmn = personalChats.value[pcIndex].newMessagesNumber
            personalChats.value[pcIndex].newMessagesNumber = nmn !== undefined ? nmn + 1 : 1
          }
        }

        const latestPC = personalChats.value.splice(pcIndex, 1)[0]

        // todo: auto enai apo getter opote den douleveiswsta na mpei se ref
        personalChats.value.unshift(latestPC)
      })

      socket.on('message-read', (data: LastReadMessagePivot) => {
        if (!data.personalChat || data.user.id !== user.value?.id) {
          return
        }

        const pcIndex = personalChats.value.findIndex(pc => pc.id === data.personalChat?.id)

        if (pcIndex < 0) {
          return
        }

        personalChats.value[pcIndex].newMessagesNumber = 0
      })
    })

    return {
      user,
      personalChatsFiltered,
      search,
      openAddFriend
    }
  }
})
</script>
