<template>
  <div class="q-pa-md flex justify-center items-center w-full h-screen">
    <transition>
      <div
        class="p-10 bg-glass min-w-96 overflow-hidden"
      >
        <transition-group>
          <q-form
            v-if="!emailResetResponse"
            class="q-gutter-md"
            @submit="resetPassword"
          >
            <q-input
              v-model="email"
              label="Email"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please enter your email' ]"
            />

            <div class="flex flex-col gap-3">
              <q-btn
                unelevated
                label="Reset Password"
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
            class="flex flex-col items-center justify-center gap-4"
          >
            <div
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

            <transition
              appear
            >
              <div
                class="animate__animated animate__fadeIn animate__delay-1s w-full"
              >
                <q-btn
                  color="secondary"
                  label="Back"
                  to="/auth/login"
                  class="w-full"
                />
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
  components: { },
  setup () {
    const email = ref('')
    const emailResetResponse = ref(false)

    const userStore = useAuthUser()

    const { loading } = storeToRefs(userStore)

    const resetPassword = async () => {
      const response = await userStore.resetPassword(email.value)

      emailResetResponse.value = !!response
    }

    return {
      loading,
      email,
      emailResetResponse,
      resetPassword
    }
  }
})
</script>
