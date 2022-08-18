<template>
  <div class="q-pa-md flex justify-center items-center w-full h-screen">
    <div v-if="loggedOut">
      You have been logged out
      <q-btn
        color="primary"
        label="Login"
        to="/login"
      />
    </div>
    <div
      v-else
    >
      You are being logged out
      <q-spinner-gears
        color="primary"
        size="3rem"
        :thickness="5"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

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
    const loggedOut = ref(false)
    onMounted(() => {
      setTimeout(async () => {
        loggedOut.value = !!await userStore.logout()
      }, 2000)
    })

    return {
      loggedOut
    }
  }
})
</script>
