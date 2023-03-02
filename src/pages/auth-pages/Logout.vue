<template>
  <div class="q-pa-md flex justify-center items-center w-full h-screen">
    <transition>
      <div
        v-if="loggedOut"
        class="flex flex-col items-center gap-2"
      >
        <div>
          You have been logged out
        </div>
        <q-btn
          color="primary"
          label="Login"
          to="/auth/login"
        />
      </div>
      <div
        v-else
        class="flex flex-col items-center gap-2"
      >
        <div>
          You are being logged out
        </div>
        <q-spinner
          color="primary"
          size="3rem"
          :thickness="5"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

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
