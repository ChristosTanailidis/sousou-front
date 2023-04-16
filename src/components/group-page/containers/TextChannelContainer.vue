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
        if (message.textChannel?.id !== props.textChannelId) {
          return
        }

        latestMessages.value.push(message)
      })
    })

    // todo: mallon pir sto group to read
    const lastReadMessageIndex = computed((): MessageReadIndex[] => {
      const latestIndex = latestMessages.value.findLastIndex(lm => lm.readBy?.map(rb => rb.user).find(rbu => rbu.id === props.friend.id) && lm.from.id !== props.friend.id)

      if (latestIndex > -1) {
        return [{
          user: props.friend,
          indexNew: latestIndex
        }]
      }

      const oldIndex = oldMessages.value.data.findLastIndex(lm => lm.readBy?.map(rb => rb.user).find(rbu => rbu.id === props.friend.id))

      if (oldIndex > -1 && oldMessages.value.data[oldIndex].from.id !== props.friend.id) {
        return [{
          user: props.friend,
          indexOld: oldIndex
        }]
      }

      return []
    })

    return {
      latestMessages,
      oldMessagesPagination,
      oldMessages,
      loading,

      lastReadMessageIndex,

      fetchMorePaginatedMessages,
      sendMessage,
      readMessage,

      formatDistanceToNow
    }
  }
})
</script>
