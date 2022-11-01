<template>
  :)
  <q-input
    v-model="voiceChannelObj.fakeField"
    type="text"
    label="Label"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

// components

// models

// stores

// utils

export default defineComponent({
  props: {
    textChannel: {
      type: Object as PropType<{ fakeField: string}>,
      default: () => {
        return { fakeField: '' }
      }
    }
  },
  setup (props) {
    const voiceChannelObj = ref(props.textChannel)
    return {
      voiceChannelObj

    }
  }
})
</script>
