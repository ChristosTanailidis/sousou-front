<template>
  <div
    ref="chatContainer"
    v-scroll="fetchMorePaginatedMessages"
    class="flex flex-col flex-nowrap gap-2 overflow-auto relative"
  >
    <div class="flex-grow q-pa-sm px-3 row justify-center relative">
      <q-spinner
        :class="[
          loading ? 'opacity-100' : 'opacity-0'
        ]"
        class="transition-opacity sticky top-5 left-1/2 transform -translate-x-1/2 shadow"
        color="primary"
        size="3rem"
        :thickness="5"
      />
      <div style="width: 100%">
        <div class="flex flex-col-reverse">
          <q-chat-message
            v-for="(message, index) in oldMessages.data"
            :key="message.id"
            :name="message.from.id !== friend.id ? friend.displayName + '#' + latestMessages[index - 1][0].from.id !== friend.id ? friend.code : 'you' : undefined"
            :text="[message.text]"
            :sent="message.from.id === friend.id"
            :text-color="message.from.id !== friend.id ? 'black' : 'white'"
            :bg-color="message.from.id !== friend.id ? 'amber-7' : 'primary'"
          >
            <template #stamp>
              <div :key="clock">
                {{ formatDistanceToNow(new Date(message.createdAt)) }} ago
              </div>
            </template>
          </q-chat-message>
        </div>

        <q-chat-message
          v-for="(message, index) in latestMessages"
          :key="message[0].id"
          :name="message[0].from.id !== friend.id ? friend.displayName + '#' + latestMessages[index - 1][0].from.id !== friend.id ? friend.code : 'you' : undefined"
          :text="message.map(m => m.text)"
          :sent="message[0].from.id === friend.id"
          :text-color="message[0].from.id !== friend.id ? 'black' : 'white'"
          :bg-color="message[0].from.id !== friend.id ? 'amber-7' : 'primary'"
        >
          <template #stamp>
            <div :key="clock">
              {{ formatDistanceToNow(new Date(message[message.length - 1].createdAt)) }} ago
            </div>
          </template>
        </q-chat-message>
      </div>
    </div>
    <div class="sticky bottom-0 left-0 w-full  bg-dark-200">
      <q-input
        v-model="text"
        :autofocus="true"
        type="text"
        label="Message"
        class="p-2"
        @keydown.enter="sendMessage()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { socket } from 'src/boot/socket_io'

// components

// models
import { PersonalMessage } from 'src/models/PersonalMessage'
import { PaginatedData } from 'src/models/PaginatedData'
import { User } from 'src/models/User'

// stores
import { useAuthUser } from 'src/stores/auth-user'
import { useUsersStore } from 'src/stores/users'

// utils
import { formatDistanceToNow } from 'date-fns'
import { PaginationData } from 'src/models/PaginationData'

// todo: na ginei ena component gia chat eite personal eite group.
export default defineComponent({
  props: {
    personalChatId: {
      type: String,
      required: true
    },
    friend: {
      type: Object as PropType<User>,
      required: true
    }
  },
  setup (props) {
    const text = ref('')
    const oldMessagesPagination = ref<PaginationData>({
      limit: 20,
      page: 1
    })
    const oldMessages = ref<PaginatedData<PersonalMessage>>({
      data: [],
      total: 0
    })
    const latestMessages = ref<PersonalMessage[][]>([])
    const chatContainer = ref<Element>()
    const clock = ref('')

    const userStore = useAuthUser()
    const { user } = storeToRefs(userStore)

    const usersStore = useUsersStore()
    const { loading } = storeToRefs(userStore)

    const sendMessage = () => {
      if (text.value === '') {
        return
      }

      socket.emit('message-send', {
        identifier: props.personalChatId,
        personal: true,
        text: text.value
      })

      text.value = ''
    }

    const fetchPaginatedMessages = async () => {
      return await usersStore.fetchPersonalMessages(oldMessagesPagination.value, props.personalChatId)
    }

    const fetchDebounce = ref()

    const fetchMorePaginatedMessages = async (position: number) => {
      if ((position && position > 150) || (oldMessages.value.total === oldMessages.value.data.length) || loading.value) {
        return
      }

      if (fetchDebounce.value) {
        return
      }

      loading.value = true

      fetchDebounce.value = setTimeout(async () => {
        if (chatContainer.value) {
          chatContainer.value.scrollTop = 150
        }

        oldMessagesPagination.value.page++
        const result = await fetchPaginatedMessages()

        if (!result) {
          return
        }

        oldMessages.value.data = [...oldMessages.value.data, ...result.data]
        oldMessages.value.total = result.total

        fetchDebounce.value = undefined
        loading.value = false
      }, 500)
    }

    const scrollToBottom = () => {
      setTimeout(() => {
        if (chatContainer.value) {
          chatContainer.value.scrollTop = chatContainer.value.scrollHeight
        }
      }, 100)
    }

    onMounted(async () => {
      const omResult = await fetchPaginatedMessages()

      if (!omResult || !chatContainer.value) {
        return
      }

      oldMessages.value = omResult

      scrollToBottom()

      setInterval(() => {
        /* This interval updates the minutes passed since the last message was sent */
        clock.value = (new Date()).toString()
      }, 1000 * 30)

      socket.open() // todo: check if this can be removed. first attempt of connection has token: null.
      socket.on('message-receive', (message: PersonalMessage) => {
        const lastMessageGroup = latestMessages.value[latestMessages.value.length - 1]
        const lastMessage = lastMessageGroup ? lastMessageGroup[lastMessageGroup.length - 1] : undefined

        if (
          lastMessage &&
          (message.from.id === lastMessage.from.id) && // groups text together if its from the same user
          ((new Date(message.createdAt)).valueOf() - (new Date(lastMessage?.createdAt)).valueOf() < 1000 * 15) // groups text on last 15 seconds
        ) {
          latestMessages.value[latestMessages.value.length - 1].push(message)
        } else {
          latestMessages.value.push([message])
        }

        if (message.from.id === user.value?.id) {
          scrollToBottom()
        }
      })
    })

    return {
      text,
      sendMessage,
      latestMessages,
      chatContainer,

      oldMessages,
      loading,
      fetchMorePaginatedMessages,

      formatDistanceToNow,
      clock
    }
  }
})
</script>
