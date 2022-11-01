<template>
  :) alla voice
  <q-input
    v-model="voiceChannelObj.fakeField"
    type="text"
    label="Label"
    :rules="[ (val) => !!val || 'EEEEEEEE!!' ]"
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
    voiceChannel: {
      type: Object as PropType<{ fakeField: string}>,
      default: () => {
        return { fakeField: '' }
      }
    }
  },
  emits: ['submit-form', 'reset-form'],
  setup (props) {
    const voiceChannelObj = ref(props.voiceChannel)
    return {
      voiceChannelObj

    }
  }
})
</script>
