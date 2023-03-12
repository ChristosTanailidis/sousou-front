<template>
  <div class="q-pa-md flex justify-center items-center w-full h-screen">
    <div class="p-10 bg-glass min-w-96 overflow-hidden">
      <transition-group>
        <q-form
          v-if="!registrationResponse"
          class="q-gutter-md"
          @submit="register"
        >
          <q-input
            v-model="registerData.displayName"
            type="text"
            label="Displayed Name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please enter your displayed name' ]"
          />

          <q-input
            v-model="registerData.email"
            type="email"
            label="Email"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please enter your email' ]"
          />

          <q-input
            v-model="registerData.username"
            type="text"
            label="Username"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please enter your username' ]"
          />

          <q-input
            v-model="registerData.password"
            type="password"
            label="Password"
            lazy-rules
            reactive-rules
            :rules="[ val => val && val.length > 0 || 'Please enter your password' ]"
          />

          <q-input
            v-model="passwordConfirm"
            type="password"
            label="Confirm Password"
            lazy-rules
            reactive-rules
            :rules="[
              val => val && val.length > 0 || 'Please repeat your password',
              val => val === registerData.password || 'Your passwords don\'t match'
            ]"
          />

          <div class="flex flex-col gap-3">
            <q-btn
              unelevated
              label="Register"
              type="submit"
              color="primary"
              class="w-full"
              :loading="loading"
            />

            <router-link
              to="/auth/login"
            >
              <q-btn
                unelevated
                label="Login"
                color="secondary"
                class="w-full"
              />
            </router-link>
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
            An activation email has been sent to you.

            <transition
              appear
            >
              <div style="transition-delay: 700ms !important;">
                <q-icon name="check" />
              </div>
            </transition>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

// Models
import { RegisterUser } from 'src/models/InputData'

// Stores
import { useAuthUser } from 'src/stores/auth-user'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'IndexPage',
  components: { },
  setup () {
    const registerData = ref<RegisterUser>({
      email: '',
      password: '',
      displayName: '',
      username: ''
    })

    const passwordConfirm = ref('')

    const userStore = useAuthUser()
    const { loading } = storeToRefs(userStore)

    const router = useRouter()

    const registrationResponse = ref()

    const register = async () => {
      registrationResponse.value = await userStore.register(registerData.value)

      if (registrationResponse.value) {
        setTimeout(() => {
          router.push('/auth/login')
        }, 5000)
      }
    }

    return {
      register,
      registerData,
      passwordConfirm,
      registrationResponse,
      loading
    }
  }
})
</script>
