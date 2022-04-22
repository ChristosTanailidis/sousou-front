<template>
  <div>
    <div>
      <pre>{{ formData }}</pre>
      <FormKit
        v-model="formData"
        type="form"
        submit-label="Login"
        submit-behavior="live"
        @submit="submitHandler"
      >
        <FormKit
          label="Email"
          name="email"
          type="text"
          validation="required"
        />
        <FormKit
          label="Password"
          name="password"
          type="text"
          validation="required"
        />
      </FormKit>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormKit } from '@formkit/vue';

// interfaces
import type { UserLoginInputData } from '~/assets/input-data/user'

// stores
import { useLocalUser } from '~/stores/local-user'

const router = useRouter()
const localUser = useLocalUser()

const formData = ref<UserLoginInputData|undefined>()
const submitHandler = async() => {
  if (!formData.value) return

  const userInputData: UserLoginInputData = {
    email: formData.value.email,
    password: formData.value.password,
  }

  const result = await localUser.loginUser(userInputData)

  if (!result) {
    // todo: notify?
    return
  }

  // Redirect to home when logged
  router.push({path : '/'})
}

</script>

<route lang="yaml">
alias: /welcome/login
meta:
  layout: welcome
</route>