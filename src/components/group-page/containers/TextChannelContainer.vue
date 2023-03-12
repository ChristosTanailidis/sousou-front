<template>
  <TextChat
    v-model:loading="loading"
    :old-messages="oldMessages"
    :old-messages-pagination="oldMessagesPagination"
    :latest-messages="latestMessages"
    @fetch-more-paginated-messages="fetchMorePaginatedMessages"
    @send-message="sendMessage"
    @read-message="readMessage"
  />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { socket } from 'src/boot/socket_io'

// components
import TextChat from 'src/components/TextChat.vue'

// models
import { TextChannelMessage } from 'src/models/TextChannelMessage'
import { PaginationData } from 'src/models/PaginationData'
import { PaginatedData } from 'src/models/PaginatedData'

// stores
import { useGroupsStore } from 'src/stores/groups'

// utils
import { formatDistanceToNow } from 'date-fns'

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
    const oldMessagesPagination = ref<PaginationData>({
      limit: 20,
      page: 1
    })

    const oldMessages = ref<PaginatedData<TextChannelMessage>>({
      data: [],
      total: 0
    })

    const latestMessages = ref<TextChannelMessage[][]>([])

    const groupStore = useGroupsStore()
    const { loading } = storeToRefs(groupStore)

    const sendMessage = (message: string) => {
      socket.emit('message-send', {
        identifier: props.textChannelId,
        personal: false,
        text: message
      })
    }

    const readMessage = (messageId: string) => {
      socket.emit('message-read', {
        personalChatId: props.textChannelId,
        personal: false,
        messageId
      })
    }

    const fetchPaginatedMessages = async () => {
      return await groupStore.fetchGroupChannelMessages(oldMessagesPagination.value, props.textChannelId)
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

    onMounted(async () => {
      const omResult = await fetchPaginatedMessages()

      if (!omResult) {
        return
      }

      oldMessages.value = omResult

      // socket.open() // todo: check if this can be removed. first attempt of connection has token: null.
      socket.on('message-receive', (message: TextChannelMessage) => {
        console.log(message)
        if (message.textChannel?.id !== props.textChannelId) {
          return
        }

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
      readMessage,

      formatDistanceToNow

    }
  }
})
</script>
