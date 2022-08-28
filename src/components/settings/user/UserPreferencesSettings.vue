<template>
  <div>
    USER PREFERENCES SETTINGS
    <pre>{{ user?.preferences }}</pre>
  </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia'
import { defineComponent } from 'vue'

// components

// models

// stores
import useUserStore from 'src/stores/auth-user'

// utils

export default defineComponent({
  components: {},
  props: { },
  emits: [],
  setup () {
    const userStore = useUserStore()

    const { user } = storeToRefs(userStore)
    return {
      user

    }
  }
})
</script>
