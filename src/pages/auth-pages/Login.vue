<template>
  <div class="q-pa-md flex justify-center items-center w-full h-screen">
    <transition>
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
            label="Email"
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
