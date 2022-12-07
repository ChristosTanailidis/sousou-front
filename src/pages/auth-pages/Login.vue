<template>
  <div class="q-pa-md flex justify-center items-center w-full h-screen">
    <div class="p-10 bg-glass min-w-96">
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

// Models
import { LoginUser } from 'src/models/InputData'

// Stores
import { useAuthUser } from 'src/stores/auth-user'

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

    const login = async () => {
      const response = await userStore.login(loginData.value)
      if (!response) return

      if (typeof (response) === 'string') {
        router.push('/')
      } else {
        if (response.includes('EMAIL_NOT_CONFIRMED')) {
          router.push(`/auth/resend-email-confirmation/${loginData.value.email}`)
        }
      }
    }

    return {
      login,
      loginData
    }
  }
})
</script>
