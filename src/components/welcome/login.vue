<template>
  <div>
    <div>
      <pre>{{ formData }}</pre>
      <FormKit
        v-model="formData"
        type="form"
        submit-label="Login"
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
import { onMounted, ref } from 'vue'
import { notify as vNotify } from '@kyvg/vue3-notification'
import type { UserLoginInputData } from '~/assets/input-data/user'
import { useLocalUser } from '~/stores/local-user'

onMounted(() => {
  vNotify({
    type: 'error',
    title: 'test',
  })
})

const router = useRouter()

const formData = ref<UserLoginInputData|undefined>()
const submitHandler = async() => {
  if (!formData.value) return

  const userInputData: UserLoginInputData = {
    email: formData.value.email,
    password: formData.value.password,
  }

  const result = useLocalUser().loginUser(userInputData)

  if (!result) {
    // todo: notify?
    return
  }

  router.push('/')
}

</script>
