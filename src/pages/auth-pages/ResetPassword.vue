<template>
  <div class="q-pa-md flex justify-center items-center w-full h-screen">
    <transition>
      <div
        class="p-10 bg-glass min-w-96 overflow-hidden"
      >
        <transition-group>
          <q-form
            v-if="!passwordResetResponse"
            class="q-gutter-md"
            @submit="resetPassword"
          >
            <!-- todo: add rules gia ola ta password input pou pane stin vasi (register/reset) -->
            <q-input
              v-model="password"
              type="password"
              label="Password"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please enter your password' ]"
            />

            <q-input
              v-model="repeatPassword"
              type="password"
              label="Confirm Password"
              lazy-rules
              reactive-rules
              :rules="[
                val => val && val.length > 0 || 'Please repeat your password',
                val => val && val === password || 'Your passwords don\'t match'
              ]"
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
            class="flex flex-col flex-nowrap gap-4"
          >
            <div
              class="text-[1.2rem] text-gray-300 flex flex-row flex-nowrap gap-1"
            >
              Your password has been reset!

              <transition
                appear
              >
                <div style="transition-delay: 700ms !important;">
                  <q-icon name="check" />
                </div>
              </transition>
            </div>

            <q-btn
              to="/auth/login"
              unelevated
              color="secondary"
              label="Login"
            />
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
  props: {
    resetToken: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const password = ref('')
    const repeatPassword = ref('')

    const passwordResetResponse = ref(false)

    const userStore = useAuthUser()

    const { loading } = storeToRefs(userStore)

    const resetPassword = async () => {
      const response = await userStore.setNewPassword(password.value, props.resetToken)

      passwordResetResponse.value = !!response
    }

    return {
      loading,
      password,
      repeatPassword,
      passwordResetResponse,
      resetPassword
    }
  }
})
</script>
