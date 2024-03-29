<template>
  <div class="flex flex-col flex-nowrap justify-center relative h-full ">
    <div
      ref="chatContainer"
      v-scroll="fetchMorePaginatedMessages"
      class="flex-grow px-3 row justify-center relative h-full overflow-auto"
    >
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
        class="relative "
      >
        <div class="flex flex-col-reverse">
          <!-- :name="message.from.id === user?.id ? user?.displayName + '#' + oldMessages.data[index].from.id !== user?.id ? user?.code : 'you' : undefined" -->
          <div
            v-for="(message, index) in oldMessages.data"
            :key="message.id"
            class="flex flex-row flex-nowrap gap-1 items-center"
            :class="[
              message.from.id === user?.id ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              class="flex flex-row-reverse gap-2 items-center"
            >
              <!-- v-for="readByUser in getValidReadByUsers(message.readBy?.map(rb => rb.user), message.from)" -->
              <div
                v-if="lastReadMessageIndexes.find(messageRead => messageRead.indexOld === index)"
                :key="index + 'RBU'"
              >
                <UserImage
                  :user="lastReadMessageIndexes.find(messageRead => messageRead.indexOld === index)?.user"
                  text-size="0.8rem"
                  class="w-4 h-4 rounded-full overflow-hidden"
                />
              </div>
            </div>

            <q-chat-message
              v-if="!(message as PersonalMessage).callData"
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

              <template
                v-if="members?.length && message.from.id !== user?.id"
                #name
              >
                <div class="text-gray-300">
                  {{ members?.find(m => m.id === message.from.id)?.displayName }}
                </div>
              </template>

              <template
                v-if="members?.length && message.from.id !== user?.id"
                #avatar
              >
                <UserImage
                  :user="members?.find(m => m.id === message.from.id)"
                  class="rounded-full w-[3rem] h-[3rem] mr-4"
                />
              </template>
            </q-chat-message>
            <div
              v-else
              class="flex h-[4rem] w-full items-center justify-center my-4"
            >
              <CallMessage
                :message="message"
              />
            </div>
          </div>
        </div>

        <div
          v-if="latestMessages.length"
          class="flex flex-col"
        >
          <!-- :name="message.from.id === user?.id ? user?.displayName + '#' + oldMessages.data[index].from.id !== user?.id ? user?.code : 'you' : undefined" -->
          <div
            v-for="(message, index) in latestMessages"
            :key="message.id"
            class="flex flex-row flex-nowrap gap-1 items-center"
            :class="[
              message.from.id === user?.id ? 'justify-end' : 'justify-start'
            ]"
          >
            <div

              class="flex flex-row-reverse gap-2 items-center"
            >
              <!-- v-for="readByUser in getValidReadByUsers(message.readBy?.map(rb => rb.user), message.from)" -->
              <div
                v-if="lastReadMessageIndexes.find(messageRead => messageRead.indexNew === index)"
                :key="index + 'RBU'"
              >
                <UserImage
                  :user="lastReadMessageIndexes.find(messageRead => messageRead.indexNew === index)?.user"
                  text-size="0.8rem"
                  class="w-4 h-4 rounded-full overflow-hidden"
                />
              </div>
            </div>

            <!-- :name="message[0].from.id === user?.id ? user?.displayName + '#' + latestMessages[index - 1][0].from.id !== user?.id ? user?.code : 'you' : undefined" -->
            <q-chat-message
              v-if="!(message as PersonalMessage).callData"
              :key="message.id"
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

              <div>
                {{ message.text }}
              </div>

              <template
                v-if="members?.length && message.from.id !== user?.id"
                #name
              >
                <div class="text-gray-300">
                  {{ members?.find(m => m.id === message.from.id)?.displayName }}
                </div>
              </template>

              <template
                v-if="members?.length && message.from.id !== user?.id"
                #avatar
              >
                <UserImage
                  :user="members?.find(m => m.id === message.from.id)"
                  class="rounded-full w-[3rem] h-[3rem] mr-4"
                />
              </template>
            </q-chat-message>
            <div
              v-else
              class="flex h-[4rem] w-full items-center justify-center my-4"
            >
              <CallMessage
                :message="message"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="sticky bottom-0 left-0 w-full bg-dark-200">
      <q-input
        :key="user?.id"
        v-model="newText"
        :disable="disabled"
        :autofocus="!disabled"
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
import UserImage from 'src/components/reusables/UserImage.vue'
import CallMessage from './reusables/CallMessage.vue'

// models
import { TextChannelMessage } from 'src/models/TextChannelMessage'
import { PersonalMessage } from 'src/models/PersonalMessage'
import { PaginationData } from 'src/models/PaginationData'
import { PaginatedData } from 'src/models/PaginatedData'
import { User } from 'src/models/User'

// stores
import { useAuthUser } from 'src/stores/auth-user'

// utils
import { format, formatDistance, formatDistanceToNow } from 'date-fns'

export interface MessageReadIndex {
  user: User,
  indexOld?: number
  indexNew?: number
}

export default defineComponent({
  components: {
    UserImage,
    CallMessage
  },
  props: {
    oldMessages: {
      type: Object as PropType<PaginatedData<PersonalMessage | TextChannelMessage>>,
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
      type: Array as PropType<Array<PersonalMessage | TextChannelMessage>>,
      default: () => []
    },
    lastReadMessageIndexes: {
      type: Array as PropType<Array<MessageReadIndex>>,
      default: () => []
    },
    members: {
      type: Array as PropType<Array<User>>,
      default: undefined
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
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

        let latestMessage

        if (i1 >= 0) {
          latestMessage = latestMessages[i1]
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
      }, 300)
    }

    onMounted(async () => {
      scrollToBottom()

      setInterval(() => {
        /* This interval updates the minutes passed since the last message was sent */
        clock.value = (new Date()).toString()
      }, 1000 * 30)
    })

    watch([
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

      getValidReadByUsers: (users?: User[], fromUser?: User) => {
        return users?.filter(u => u.id !== user?.value?.id && u.id !== fromUser?.id)
      },
      formatDistanceToNow,
      formatDistance,
      format,
      clock
    }
  }
})
</script>
