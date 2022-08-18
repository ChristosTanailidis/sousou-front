<template>
  <div>
    PREFERENCES SETTINGS GROUP
    <pre>{{ group.preferences }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

// components

// models
import { Group } from 'src/models/Group'

// stores

// utils

export default defineComponent({
  components: {},
  props: {
    group: {
      type: Object as PropType<Group>,
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
