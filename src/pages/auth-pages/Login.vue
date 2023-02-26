<template>
  <div class="q-pa-md flex flex-col gap-5 justify-center items-center w-full h-screen pt-[4rem]">
    <transition appear>
      <div
        v-if="!loading"
        class="p-10 bg-glass min-w-96"
      >
        <q-form
          class="q-gutter-md "
          @submit="login"
        >
          <q-input
            v-model="loginData.email"
            label="Email or Username"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please enter your email' ]"
          />

          <q-input
            v-model="loginData.password"
            type="password"
            label="Password"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please enter your password' ]"
          />

          <div class="flex flex-col gap-3">
            <q-btn
              unelevated
              label="Login"
              type="submit"
              color="primary"
              class="w-full"
            />

            <router-link
              to="/auth/register"
            >
              <q-btn
                unelevated
                label="Register"
                color="secondary"
                class="w-full"
              />
            </router-link>
          </div>
        </q-form>
      </div>
      <div
        v-else
        class="flex flex-col items-center gap-2"
      >
        <div>
          You are being logged in
        </div>
        <q-spinner-gears
          color="primary"
          size="3rem"
          :thickness="5"
        />
      </div>
    </transition>

    <transition
      name="forgot-password"
      appear
    >
      <div
        v-if="!loading"
        class="bg-glass p-2 min-w-96"
      >
        <div class="flex flex-col gap-1 items-center ">
          <div class="text-[1.4rem] p-1 text-gray-300">
            Having trouble signing in?
          </div>

          <div class="flex flex-row gap-2 items-center ">
            <router-link
              to="/auth/resend-email-confirmation"
              class="p-1 hover:text-primary transition"
            >
              Activate Account
            </router-link>

            <div class="text-gray-300">
              OR
            </div>

            <router-link
              to="/auth/forgot-password"
              class="p-1 hover:text-primary transition"
            >
              Reset Password
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

// Models
import { LoginUser } from 'src/models/InputData'

// Stores
import { useAuthUser } from 'src/stores/auth-user'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'IndexPage',
  components: { },
  setup () {
    const loginData = ref<LoginUser>({
      email: '',
      password: ''
    })

    const userStore = useAuthUser()

    const router = useRouter()

    const { loading } = storeToRefs(userStore)

    const login = async () => {
      const response = await userStore.login(loginData.value)
      if (!response) return

      if (typeof (response) === 'string') {
        router.push('/')
      } else {
        if (response === 'EMAIL_NOT_CONFIRMED') {
          router.push(`/auth/resend-email-confirmation/${loginData.value.email}`)
        }
      }
    }

    return {
      login,
      loginData,
      loading
    }
  }
})
</script>
