<template>
  <div>
    <div>
      <pre>{{ formData }}</pre>
      <FormKit
        v-model="formData"
        type="form"
        submit-label="Register"
        @submit="submitHandler"
      >
        <FormKit
          label="Username"
          name="username"
          type="text"
          validation="required"
        />
        <FormKit
          label="Email"
          name="email"
          type="text"
          validation="required|email"
        />
        <div class="flex flex-row gap-x-2">
          <FormKit
            label="Password"
            name="password"
            type="text"
            validation="required|length:6|matches:/[^a-zA-Z]/"
            :validation-messages="{
              matches: 'Please include at least one symbol',
            }"
          />
          <FormKit
            label="Confirm Password"
            name="password_confirm"
            type="text"
            validation="required|confirm"
          />
        </div>
      </FormKit>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserInputData } from '~/assets/entities/input-data/user'
import { useLocalUser } from '~/stores/local-user'

// const router = useRouter()

const formData = ref<UserInputData|undefined>()
const submitHandler = async() => {
  if (!formData.value) return

  const userInputData: UserInputData = {
    username: formData.value.username,
    email: formData.value.email,
    password: formData.value.password,
  }

  const result = useLocalUser().createUser(userInputData)

  if (!result) return
}

</script>

<route lang="yaml">
meta:
  layout: welcome
</route>
