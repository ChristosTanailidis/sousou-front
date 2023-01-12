<template>
  <TextChat
    v-model:loading="loading"
    :old-messages="oldMessages"
    :old-messages-pagination="oldMessagesPagination"
    :latest-messages="latestMessages"
    :last-read-message="lastReadMessage"
    @fetch-more-paginated-messages="fetchMorePaginatedMessages"
    @send-message="sendMessage"
    @read-message="readMessage"
  />
</template>

<script lang="ts">
import { defineComponent, ref, PropType, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { socket } from 'src/boot/socket_io'

// components
import TextChat from 'src/components/TextChat.vue'

// models
import { PersonalMessage } from 'src/models/PersonalMessage'
import { PaginatedData } from 'src/models/PaginatedData'
import { User } from 'src/models/User'

// stores
import { useUsersStore } from 'src/stores/users'

// utils
import { PaginationData } from 'src/models/PaginationData'

export default defineComponent({
  components: { TextChat },
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
    const chatContainer = ref<Element>()

    const oldMessagesPagination = ref<PaginationData>({
      limit: 20,
      page: 1
    })
    const oldMessages = ref<PaginatedData<PersonalMessage>>({
      data: [],
      total: 0
    })
    const latestMessages = ref<PersonalMessage[][]>([])

    const lastReadMessage = ref<string>()

    const usersStore = useUsersStore()
    const { loading } = storeToRefs(usersStore)

    const sendMessage = (message: string) => {
      socket.emit('message-send', {
        identifier: props.personalChatId,
        personal: true,
        text: message
      })
    }

    const readMessage = (messageId: string) => {
      socket.emit('message-read', {
        personalChatId: props.personalChatId,
        personal: true,
        messageId
      })
    }

    const fetchPaginatedMessages = async () => {
      return await usersStore.fetchPersonalMessages(oldMessagesPagination.value, props.personalChatId)
    }

    const fetchMorePaginatedMessages = async () => {
      oldMessagesPagination.value.page++
      const result = await fetchPaginatedMessages()

      if (!result) {
        return
      }

      oldMessages.value.data = [...oldMessages.value.data, ...result.data]
      oldMessages.value.total = result.total
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

      scrollToBottom()

      if (!omResult) {
        return
      }

      oldMessages.value = omResult

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
      })

      socket.on('message-read', (personalChat: any) => {
        console.log('hello', personalChat)

        lastReadMessage.value = personalChat.lastReadMessage.id
      })
    })

    return {
      latestMessages,
      oldMessagesPagination,
      oldMessages,
      lastReadMessage,
      loading,

      fetchMorePaginatedMessages,
      sendMessage,
      readMessage
    }
  }
})
</script>
