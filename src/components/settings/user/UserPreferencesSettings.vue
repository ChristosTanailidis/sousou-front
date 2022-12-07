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
import { useAuthUser } from 'src/stores/auth-user'

// utils

export default defineComponent({
  components: {},
  props: { },
  emits: [],
  setup () {
    const userStore = useAuthUser()

    const { user } = storeToRefs(userStore)
    return {
      user

    }
  }
})
</script>
