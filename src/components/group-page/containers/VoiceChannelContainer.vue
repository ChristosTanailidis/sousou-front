<template>
  <div class="flex flex-col flex-nowrap gap-2 h-full">
    <div class="flex-grow q-pa-md row justify-center">
      {{ voiceChannelId }}
      <div style="width: 100%">
        <q-chat-message
          name="<span class='text-positive'>Untrusted Source</span>"
          avatar="https://cdn.quasar.dev/img/avatar3.jpg"
          :text="['hey, how are <strong>you</strong>?']"
          stamp="7 minutes ago"
          sent
          bg-color="amber-7"
        />
        <q-chat-message
          name="<span class='text-negative'>Jane (trusted name but untrusted text)</span>"
          name-html
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="[
            'doing fine, how r you?',
            'I just feel like typing a really, really, <strong>REALLY</strong> long message to annoy you...'
          ]"
          size="6"
          stamp="4 minutes ago"
          text-color="white"
          bg-color="primary"
        />
        <q-chat-message
          name="<span class='text-negative'>Jao (trusted)</span>"
          name-html
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="['<strong>Did it work?</strong>']"
          text-html
          stamp="1 minutes ago"
          size="8"
          text-color="white"
          bg-color="primary"
        />
      </div>
    </div>
    <div>
      <!-- <q-input
        v-model="text"
        type="text"
        label="Message"
        class="p-2"
      /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// components

// models

// stores

// utils

export default defineComponent({
  components: {},
  props: {
    voiceChannelId: {
      type: String,
      required: true
    }
  },
  emits: [],
  setup () {
    return {

    }
  }
})
</script>
