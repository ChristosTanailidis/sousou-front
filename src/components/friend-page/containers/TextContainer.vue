<template>
  <div class="flex flex-col flex-nowrap gap-2 h-full">
    <div class="flex-grow q-pa-md row justify-center">
      <div style="width: 100%">
        <q-chat-message
          name="<span class='text-positive'>Untrusted Source</span>"
          avatar="https://cdn.quasar.dev/img/avatar3.jpg"
          :text="['hey, how are <strong>you</strong>?']"
          stamp="7 minutes ago"
          bg-color="amber-7"
        />

        <q-chat-message
          v-for="message in latestMessages"
          :key="message.id"
          :avatar="friend.icon"
          :name="message.from.id !== friend.id ? friend.displayName + '#' + friend.code : 'you'"
          :text="[message.text]"
          :sent="message.from.id === friend.id"
          :text-color="message.from.id !== friend.id ? 'black' : 'white'"
          :bg-color="message.from.id !== friend.id ? 'amber-7' : 'primary'"
          size="8"
        />
      </div>
    </div>
    <div>
      <q-input
        v-model="text"
        type="text"
        label="Message"
        class="p-2"
        @keydown.enter="sendMessage()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { socket } from 'src/boot/socket_io'

// components

// models
import { PersonalMessage } from 'src/models/PersonalMessage'
import { User } from 'src/models/User'

// stores

// utils

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
    const latestMessages = ref<PersonalMessage[]>([])

    const sendMessage = () => {
      socket.emit('message-send', {
        identifier: props.personalChatId,
        personal: true,
        text: text.value
      })

      text.value = ''
    }

    socket.on('message-receive', (message: PersonalMessage) => {
      latestMessages.value.push(message)
    })

    return {
      text,
      sendMessage,
      latestMessages
    }
  }
})
</script>
