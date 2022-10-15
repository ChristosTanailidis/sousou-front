<template>
  <q-card flat>
    <q-form
      class="w-[75%]"
      @submit="onSubmit"
      @reset="onReset"
    >
      <q-card-section class="flex flex-col flex-nowrap gap-2">
        <!-- todo: this might be helpful someday -> reactive-rules -->
        <q-input
          v-model="userData.username"
          type="text"
          label="Username"
          reactive-rules
          :debounce="750"
          :rules="[
            val => !!val || 'Username is required',
            val => val.length >= 5 || 'A username must contain at least 5 characters',
            async val => await checkUsernameAvailability(val) || 'Username is already taken'
          ]"
        />

        <q-input
          v-model="userData.displayName"
          type="text"
          label="Display Name"
          :rules="[
            val => !!val || 'Display name is required',
            val => val.length > 3 || 'The display name must contain at least 3 characters'
          ]"
        />

        <q-input
          v-model="userData.icon"
          type="text"
          label="Image URL"
        />
      </q-card-section>

      <q-card-actions class="flex gap-1">
        <q-btn
          unelevated
          icon="save"
          label="save"
          color="primary"
          class="flex-grow"
          type="submit"
          :disabled="loading"
          :loading="loading"
        />
        <q-btn
          unelevated
          color="secondary"
          label="Reset"
          icon="restart_alt"
          type="reset"
          :disabled="loading"
          :loading="loading"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

// components

// models
import { UpdateUserData } from 'src/models/InputData'
import { User } from 'src/models/User'

// stores
import useUserStore from 'src/stores/auth-user'

// utils
import notify from 'src/utils/notify'
import { storeToRefs } from 'pinia'

export default defineComponent({
  components: {},
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    }
  },
  emits: [],
  setup (props) {
    const userData = ref<UpdateUserData>({
      displayName: props.user.displayName,
      username: props.user.username,
      icon: props.user.icon
    })

    const originalUserData = { ...userData.value } as UpdateUserData

    const userStore = useUserStore()
    const { loading } = storeToRefs(userStore)

    const onSubmit = async () => {
      const resp = await userStore.updateUser(userData.value)
      if (!resp) {
        return
      }

      notify('success', 'Saved')

      userStore.fetchUser()
    }

    const usernameIsAvailable = ref(true)

    const checkUsernameAvailability = async (newUsername: string | number | null) => {
      if (typeof (newUsername) !== 'string') {
        return false
      }

      if (newUsername === props.user.username) {
        // no changes on the username
        return true
      }

      const exists = await userStore.checkUsernameAvailability(newUsername)
      usernameIsAvailable.value = !exists

      return !exists
    }

    return {
      userData,

      checkUsernameAvailability,
      usernameIsAvailable,
      loading,

      onSubmit,
      onReset: () => { userData.value = { ...originalUserData } }
    }
  }
})
</script>
