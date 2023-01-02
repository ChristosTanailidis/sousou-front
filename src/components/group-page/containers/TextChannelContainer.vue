<template>
  <TextChat
    v-model:loading="loading"
    :old-messages="oldMessages"
    :old-messages-pagination="oldMessagesPagination"
    :latest-messages="latestMessages"
    @fetch-more-paginated-messages="fetchMorePaginatedMessages"
    @send-message="sendMessage"
  />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { socket } from 'src/boot/socket_io'

// components

// models
import { PersonalMessage } from 'src/models/PersonalMessage'
import { PaginatedData } from 'src/models/PaginatedData'

// stores
import { useUsersStore } from 'src/stores/users'

// utils
import { formatDistanceToNow } from 'date-fns'
import { PaginationData } from 'src/models/PaginationData'
import TextChat from 'src/components/TextChat.vue'

export default defineComponent({
  components: { TextChat },
  props: {
    textChannelId: {
      type: String,
      required: true
    }
  },
  emits: [],
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

    const usersStore = useUsersStore()
    const { loading } = storeToRefs(usersStore)

    const sendMessage = (message: string) => {
      socket.emit('message-send', {
        identifier: props.textChannelId,
        personal: true,
        text: message
      })
    }

    const fetchPaginatedMessages = async () => {
      // todo: return await groupStore.fetchTextChannelMessages(oldMessagesPagination.value, props.textChannelId)
      return await usersStore.fetchPersonalMessages(oldMessagesPagination.value, props.textChannelId)
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
    })

    return {
      latestMessages,
      oldMessagesPagination,
      oldMessages,
      loading,

      fetchMorePaginatedMessages,
      sendMessage,

      formatDistanceToNow
    }
  }
})
</script>
