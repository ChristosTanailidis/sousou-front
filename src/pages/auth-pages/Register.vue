<template>
  <div class="q-pa-md flex justify-center items-center w-full h-screen">
    <div class="p-10 bg-glass min-w-96">
      <q-form
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

    const router = useRouter()

    const register = async () => {
      const registered = await userStore.register(registerData.value)
      console.log('Confirm Your Email Here ➡', `http://localhost:9000/auth/confirm-email/${registered}`)
      if (registered) {
        router.push('/auth/login')
      }
    }

    return {
      register,
      registerData,
      passwordConfirm
    }
  }
})
</script>
