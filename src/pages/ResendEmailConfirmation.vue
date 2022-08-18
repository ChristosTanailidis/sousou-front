<template>
  <div class="q-pa-md flex justify-center items-center w-full h-screen">
    <q-form
      class="q-gutter-md"
      @submit="resendConfirmation"
    >
      <q-btn
        label="Resend Email Confirmation"
        type="submit"
        color="primary"
        class="w-full"
      />
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

// Stores
import useUserStore from 'src/stores/auth-user'

export default defineComponent({
  name: 'IndexPage',
  props: {
    email: {
      type: String,
      default: undefined
    }
  },
  setup (props) {
    const userStore = useUserStore()

    const router = useRouter()

    const resendConfirmation = async () => {
      if (!props.email) {
        return
      }

      const confirmed = await userStore.resendConfirmation(props.email)

      if (confirmed) {
        console.log('Confirm Your Email Here ➡', `http://localhost:9000/confirm-email/${confirmed}`)
        router.push('/')
      }
    }

    return {
      resendConfirmation
    }
  }
})
</script>
