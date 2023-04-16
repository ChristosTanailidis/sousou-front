<template>
  <!-- :last-read-message="lastReadMessage" -->
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
import { defineComponent, ref, PropType, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { socket } from 'src/boot/socket_io'

// components
import TextChat, { MessageReadIndex } from 'src/components/TextChat.vue'

// models
import { PersonalMessage } from 'src/models/PersonalMessage'
import { PaginatedData } from 'src/models/PaginatedData'
import { User } from 'src/models/User'

// stores
import { useUsersStore } from 'src/stores/users'

// utils
import { PaginationData } from 'src/models/PaginationData'
import { LastReadMessagePivot } from 'src/models/SocketData'

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
    const oldMessagesPagination = ref<PaginationData>({
      limit: 20,
      page: 1
    })

    const oldMessages = ref<PaginatedData<PersonalMessage>>({
      data: [],
      total: 0
    })

    const latestMessages = ref<PersonalMessage[]>([])

    const lastReadMessage = ref<PersonalMessage>()

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

    onMounted(async () => {
      const omResult = await fetchPaginatedMessages()

      if (!omResult) {
        return
      }

      oldMessages.value = omResult

      // socket.open() // todo: check if this can be removed. first attempt of connection has token: null.
      socket.on('message-receive', (message: PersonalMessage) => {
        if (message.personalChat?.id !== props.personalChatId) {
          return
        }

        latestMessages.value.push(message)
      })

      socket.on('message-read', (data: LastReadMessagePivot) => {
        if (!data.personalChat || data.user.id === props.friend.id) {
          return
        }

        // New message read

        const latestMessageIndex = latestMessages.value.findIndex(lm => lm.id === data.lastReadMessage.id)

        if (latestMessageIndex > -1) {
          latestMessages.value[latestMessageIndex] = data.lastReadMessage

          return
        }

        // Old message read

        const oldMessagesIndex = oldMessages.value.data.findIndex(om => om.id === data.lastReadMessage.id)

        if (oldMessagesIndex < 0) {
          return
        }

        oldMessages.value.data[oldMessagesIndex] = data.lastReadMessage
      })
    })

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
      lastReadMessage,
      oldMessages,
      loading,

      fetchMorePaginatedMessages,
      sendMessage,
      readMessage,

      lastReadMessageIndexes: lastReadMessageIndex
    }
  }
})
</script>
