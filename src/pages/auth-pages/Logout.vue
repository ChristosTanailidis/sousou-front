<template>
  <div class="q-pa-md flex justify-center items-center w-full h-screen">
    <div
      class="p-10 bg-glass min-w-96 overflow-hidden text-[1.2rem] text-gray-300"
    >
      <transition-group>
        <div
          v-if="loggedOut"
          class="flex flex-col items-center gap-4"
        >
          <div>
            You have been logged out
          </div>

          <q-btn
            color="primary"
            label="Login"
            to="/auth/login"
            class="w-full"
          />
        </div>
        <div
          v-else
          class="flex flex-col items-center gap-4"
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
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

// components

// models

// stores
import { useAuthUser } from 'src/stores/auth-user'
import { useRouter } from 'vue-router'

// utils

export default defineComponent({
  components: {},
  props: { },
  emits: [],
  setup () {
    const userStore = useAuthUser()
    const loggedOut = ref(false)

    const router = useRouter()

    onMounted(() => {
      setTimeout(async () => {
        loggedOut.value = !!(await userStore.logout())

        if (!loggedOut.value) {
          router.push('/auth/login')
        }
      }, 2000)
    })

    return {
      loggedOut
    }
  }
})
</script>
