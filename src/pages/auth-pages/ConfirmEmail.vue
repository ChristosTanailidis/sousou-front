<template>
  <div class="q-pa-md flex justify-center items-center w-full h-screen">
    <transition>
      <div
        class="p-10 bg-glass min-w-96 overflow-hidden"
      >
        <transition-group>
          <div
            v-if="loading"
            class="text-[1.2rem] text-gray-300 flex flex-col items-center flex-nowrap gap-4"
          >
            Confirming your email. Please wait.

            <q-spinner
              color="primary"
              size="3rem"
              :thickness="5"
            />
          </div>
          <div
            v-else-if="confirmEmailResponse && !loading"
            align="center"
            class="flex flex-col flex-nowrap gap-4"
          >
            <div
              class="text-[1.2rem] text-gray-300 flex flex-row flex-nowrap gap-1"
            >
              Your email has been confirmed

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
          <div
            v-else-if="confirmEmailResponse !== undefined && !confirmEmailResponse && !loading"
            align="center"
            class="flex flex-col items-center flex-nowrap gap-4 "
          >
            <div
              class="text-[1.2rem] text-gray-300 flex flex-row flex-nowrap gap-1"
            >
              Sorry, Something went wrong
            </div>

            <q-btn
              to="/auth/login"
              unelevated
              color="secondary"
              label="Go Back"
              class="w-full"
            />
          </div>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

// Stores
import { useAuthUser } from 'src/stores/auth-user'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'IndexPage',
  props: {
    emailToken: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const userStore = useAuthUser()
    const { loading } = storeToRefs(userStore)

    const confirmEmailResponse = ref<boolean>()

    const confirmEmail = () => {
      if (!props.emailToken) {
        return
      }

      loading.value = true

      setTimeout(async () => {
        confirmEmailResponse.value = !!(await userStore.confirmEmail(props.emailToken))
      }, 1500)
    }

    onMounted(() => {
      confirmEmail()
    })

    return {
      confirmEmail,
      confirmEmailResponse,
      loading
    }
  }
})
</script>
