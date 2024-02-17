<template>
  <TextChat
    v-model:loading="loading"

    :old-messages="oldMessages"
    :old-messages-pagination="oldMessagesPagination"

    :latest-messages="latestMessages"

    :last-read-message-indexes="lastReadMessageIndexes"

    @fetch-more-paginated-messages="fetchMorePaginatedMessages"
    @send-message="sendMessage"
    @read-message="readMessage"
  />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { socket } from 'src/boot/socket_io'

// components
import TextChat, { MessageReadIndex } from 'src/components/TextChat.vue'

// models
import { TextChannelMessage } from 'src/models/TextChannelMessage'
import { PaginationData } from 'src/models/PaginationData'
import { PaginatedData } from 'src/models/PaginatedData'

// stores
import { useGroupsStore } from 'src/stores/groups'

// utils
import { formatDistanceToNow } from 'date-fns'
import { TextChannel } from 'src/models/TextChannel'
import { TextChannelUserPivot } from 'src/models/SocketData'

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
    const textChannelObj = ref<TextChannel>()

    const oldMessagesPagination = ref<PaginationData>({
      limit: 20,
      page: 1
    })

    const oldMessages = ref<PaginatedData<TextChannelMessage>>({
      data: [],
      total: 0
    })

    const latestMessages = ref<TextChannelMessage[]>([])

    const groupStore = useGroupsStore()
    const { loading } = storeToRefs(groupStore)

    const sendMessage = (message: string) => {
      socket.emit('message-send', {
        identifier: props.textChannelId,
        personal: false,
        text: message
      })
    }

    const debounce = ref()

    const readMessage = (messageId: string) => {
      clearTimeout(debounce.value)
      debounce.value = setTimeout(() => {
        socket.emit('message-read', {
          personalChatId: props.textChannelId,
          personal: false,
          messageId
        })
      }, 1500)
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
      textChannelObj.value = await groupStore.fetchTextChannel(props.textChannelId)

      const omResult = await fetchPaginatedMessages()

      if (omResult) {
        oldMessages.value = omResult
      }

      // socket.open() // todo: check if this can be removed. first attempt of connection has token: null.
      socket.on('message-receive', (message: TextChannelMessage) => {
        if (message.textChannel?.id !== props.textChannelId) {
          return
        }

        latestMessages.value.push(message)
      })

      socket.on('message-read', (data: TextChannelUserPivot) => {
        if (!data.textChannel /* || data.user.id === props.friend.id */) {
          return
        }

        // New message read

        const latestMessageIndex = latestMessages.value.findIndex(lm => lm.id === data.lastReadMessage?.id)

        if (latestMessageIndex > -1 && data.lastReadMessage) {
          latestMessages.value[latestMessageIndex] = data.lastReadMessage

          return
        }

        // Old message read
        // todo: fix ta old message reads me https://github.com/Lemas97/Sousou-Api/issues/34
        const oldMessagesIndex = oldMessages.value.data.findIndex(om => om.id === data.lastReadMessage?.id)

        if (oldMessagesIndex < 0 && data.lastReadMessage) {
          oldMessages.value.data[oldMessagesIndex] = data.lastReadMessage
        }
      })
    })

    const lastReadMessageIndexes = computed((): MessageReadIndex[] => {
      // todo: textChannelObjet.value?.users
      // todo: check this again when https://github.com/Lemas97/Sousou-Api/issues/36 is fixed
      const indexArray = textChannelObj.value?.group?.members?.map(user => {
        return {
          user,
          indexNew: latestMessages.value.findLastIndex(lm => lm.readBy?.map(rb => rb.user).find(rbu => rbu.id === user.id) && lm.from.id !== user.id),
          indexOld: oldMessages.value.data.findLastIndex(om => om.readBy?.map(rb => rb.user).find(rbu => rbu.id === user.id) && om.from.id !== user.id)
        }
      })

      return indexArray || []
    })

    return {
      latestMessages,
      oldMessagesPagination,
      oldMessages,
      loading,

      lastReadMessageIndexes,

      fetchMorePaginatedMessages,
      sendMessage,
      readMessage,

      formatDistanceToNow
    }
  }
})
</script>
