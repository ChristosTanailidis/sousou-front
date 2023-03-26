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

    const latestMessages = ref<PersonalMessage[][]>([])

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

      socket.on('message-read', (data: LastReadMessagePivot) => {
        if (!data.personalChat || data.user.id !== props.friend.id) {
          return
        }

        const latestMessage1Index = latestMessages.value.findIndex(lm => lm.find(lm2 => lm2.id === data.lastReadMessage.id))
        const latestMessage2Index = latestMessage1Index >= 0 && latestMessages.value[latestMessage1Index].findIndex(lm2 => lm2.id === data.lastReadMessage.id)

        if (latestMessage2Index && latestMessage2Index > -1) {
          lastReadMessage.value = latestMessages.value[latestMessage1Index][latestMessage2Index]

          return
        }

        const oldMessagesIndex = oldMessages.value.data.findIndex(om => om.id === data.lastReadMessage.id)

        if (oldMessagesIndex < 0) {
          return
        }

        lastReadMessage.value = oldMessages.value.data[oldMessagesIndex]
      })
    })

    return {
      latestMessages,
      oldMessagesPagination,
      lastReadMessage,
      oldMessages,
      loading,

      fetchMorePaginatedMessages,
      sendMessage,
      readMessage
    }
  }
})
</script>
