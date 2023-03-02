<template>
  <div class="q-pa-md flex justify-center items-center w-full h-screen">
    <transition>
      <div
        class="p-10 bg-glass min-w-96 overflow-hidden"
      >
        <transition-group>
          <q-form
            v-if="!confirmationResponse"
            class="q-gutter-md"
            @submit="resendConfirmation"
          >
            <!-- todo: email validation -->
            <q-input
              v-model="email"
              label="Email"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please enter your email' ]"
            />

            <div class="flex flex-col gap-3">
              <q-btn
                unelevated
                label="Resend Confirmation Email"
                type="submit"
                color="primary"
                class="w-full"
                :loading="loading"
              />

              <q-btn
                to="/auth/login"
                unelevated
                label="Back"
                color="secondary"
                class="w-full"
                :disable="loading"
              />
            </div>
          </q-form>
          <div
            v-else
            align="center"
            class="text-[1.2rem] text-gray-300 flex flex-row flex-nowrap gap-1"
          >
            An email has been sent to you.

            <transition
              appear
            >
              <div style="transition-delay: 700ms !important;">
                <q-icon name="check" />
              </div>
            </transition>
          </div>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

// Stores
import { useAuthUser } from 'src/stores/auth-user'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'IndexPage',
  setup () {
    const email = ref('')
    const confirmationResponse = ref(false)

    const userStore = useAuthUser()
    const { loading } = storeToRefs(userStore)

    const resendConfirmation = async () => {
      if (!email.value.length) {
        return
      }

      confirmationResponse.value = !!(await userStore.resendConfirmation(email.value))
    }

    return {
      resendConfirmation,
      email,
      loading,
      confirmationResponse
    }
  }
})
</script>
