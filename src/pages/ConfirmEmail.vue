<template>
  <div class="q-pa-md flex justify-center items-center w-full h-screen">
    <q-form
      class="q-gutter-md"
      @submit="confirmEmail"
    >
      <q-btn
        label="Confirm Email"
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
    emailToken: {
      type: String,
      default: undefined
    }
  },
  setup (props) {
    const userStore = useUserStore()

    const router = useRouter()

    const confirmEmail = async () => {
      if (!props.emailToken) {
        return
      }
      const confirmed = await userStore.confirmEmail(props.emailToken)
      if (confirmed) {
        router.push('/')
      }
    }

    return {
      confirmEmail
    }
  }
})
</script>
