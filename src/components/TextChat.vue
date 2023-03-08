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
        class="transition-opacity sticky top-5 left-1/2 transform -translate-x-1/2 "
        color="primary"
        size="3rem"
        :thickness="5"
      />
      <div
        style="width: 100%"
        class="h-full"
      >
        <div class="flex flex-col-reverse">
          <!-- :name="message.from.id === user?.id ? user?.displayName + '#' + oldMessages.data[index].from.id !== user?.id ? user?.code : 'you' : undefined" -->
          <div
            v-for="(message) in oldMessages.data"
            :key="message.id"
            class="flex flex-row flex-nowrap gap-1 items-end"
            :class="[
              message.from.id === user?.id ? 'justify-end' : 'justify-start'
            ]"
          >
            <!-- todo: fix this -->
            <div
              v-if="lastReadMessage === message.id"
              :key="lastReadMessage"
            >
              hello
            </div>

            <q-chat-message
              :text="[message.text]"
              :sent="message.from.id === user?.id"
              :text-color="message.from.id !== user?.id ? 'black' : 'white'"
              :bg-color="message.from.id !== user?.id ? 'amber-7' : 'primary'"
            >
              <template #stamp>
                <div :key="clock">
                  {{ formatDistanceToNow(new Date(message.createdAt)) }} ago
                </div>
              </template>
            </q-chat-message>
          </div>
        </div>

        <!-- :name="message[0].from.id === user?.id ? user?.displayName + '#' + latestMessages[index - 1][0].from.id !== user?.id ? user?.code : 'you' : undefined" -->
        <q-chat-message
          v-for="(message) in latestMessages"
          :key="message[0].id"
          :text="message.map(m => m.text)"
          :sent="message[0].from.id === user?.id"
          :text-color="message[0].from.id !== user?.id ? 'black' : 'white'"
          :bg-color="message[0].from.id !== user?.id ? 'amber-7' : 'primary'"
        >
          <template #stamp>
            <div :key="clock">
              {{ formatDistanceToNow(new Date(message[message.length - 1].createdAt)) }} ago
            </div>
          </template>
        </q-chat-message>
      </div>
    </div>

    <div class="sticky bottom-0 left-0 w-full bg-dark-200">
      <q-input
        :key="user?.id"
        v-model="newText"
        :autofocus="true"
        type="text"
        label="Message"
        class="p-2"
        @keydown.enter="sendMessage()"
        @focus="readMessage()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

// components

// models
import { PersonalMessage } from 'src/models/PersonalMessage'
import { PaginationData } from 'src/models/PaginationData'
import { PaginatedData } from 'src/models/PaginatedData'

// stores
import { useAuthUser } from 'src/stores/auth-user'

// utils
import { formatDistanceToNow } from 'date-fns'

export default defineComponent({
  props: {
    oldMessages: {
      type: Object as PropType<PaginatedData<PersonalMessage>>,
      default: () => {
        return {
          data: [],
          total: 0
        }
      }
    },
    oldMessagesPagination: {
      type: Object as PropType<PaginationData>,
      default: () => {
        return {
          limit: 20,
          page: 1
        }
      }
    },
    latestMessages: {
      type: Array as PropType<Array<Array<PersonalMessage>>>,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    lastReadMessage: {
      type: String,
      default: undefined
    }
  },
  emits: ['sendMessage', 'readMessage', 'fetchMorePaginatedMessages', 'update:loading'],
  setup (props, { emit }) {
    const chatContainer = ref<Element>()
    const clock = ref('')

    const userStore = useAuthUser()
    const { user } = storeToRefs(userStore)

    const newText = ref('')

    const sendMessage = () => {
      if (newText.value === '') {
        return
      }

      emit('sendMessage', newText.value)

      newText.value = ''

      scrollToBottom()

      readMessage()
    }

    const readMessage = () => {
      setTimeout(() => {
        const { latestMessages, oldMessages } = props
        const i1 = (latestMessages?.length || 0) - 1
        const i2 = (latestMessages[i1]?.length || 0) - 1

        let latestMessage

        if (i1 >= 0 && i2 >= 0) {
          latestMessage = latestMessages[i1][i2]
        }

        if (!latestMessage) {
          latestMessage = oldMessages.data[0]
        }

        if (!latestMessage) {
          return
        }

        emit('readMessage', latestMessage.id)
      }, 500)
    }

    const fetchDebounce = ref()

    const fetchMorePaginatedMessages = async (position: number) => {
      if ((position && position > 150) || (props.oldMessages.total === props.oldMessages.data.length) || props.loading) {
        return
      }

      if (fetchDebounce.value) {
        return
      }

      emit('update:loading', true)

      fetchDebounce.value = setTimeout(async () => {
        emit('fetchMorePaginatedMessages')

        if (chatContainer.value) {
          chatContainer.value.scrollTop = 150
        }

        fetchDebounce.value = undefined
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
      scrollToBottom()

      setInterval(() => {
        /* This interval updates the minutes passed since the last message was sent */
        clock.value = (new Date()).toString()
      }, 1000 * 30)
    })

    watch([
      () => props.latestMessages[props.latestMessages.length - 1]?.length,
      () => props.latestMessages?.length
    ], () => {
      scrollToBottom()
    })

    return {
      user,
      newText,

      chatContainer,

      sendMessage,
      readMessage,
      fetchMorePaginatedMessages,

      formatDistanceToNow,
      clock
    }
  }
})
</script>
