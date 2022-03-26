<template>
  <div>
    <div>
      <pre>{{ formData }}</pre>
      <FormKit
        v-model="formData"
        type="form"
        :form-class="submitted ? 'hidden' : 'box'"
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
import { onMounted, ref } from 'vue'
import { notify as vNotify } from '@kyvg/vue3-notification'
import type UserInputData from '~/assets/input-data/user'
import { useUserMutation } from '~/hooks/mutations/user'

onMounted(() => {
  vNotify({
    type: 'error',
    title: 'test',
  })
})

const submitted = ref<boolean>(false)
const formData = ref<UserInputData|undefined>()
const submitHandler = async() => {
  // Lets pretend this is an ajax request:
  if (!formData.value) return

  const userInputData: UserInputData = {
    username: formData.value.username,
    email: formData.value.email,
    password: formData.value.password,
  }
  console.log(userInputData)

  const { addUser } = useUserMutation()

  await addUser(userInputData)

  submitted.value = true
}

</script>
