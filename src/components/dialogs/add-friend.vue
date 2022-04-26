<template>
  <div
    v-if="props.value" class="dialog"
    @click.self="emits('update:value', false)"
  >
    <div
      class="dialog-container"
    >
      <pre>
        {{ friendRequest }}
      </pre>
      <FormKit
        v-model="friendRequest"
        type="form"
        submit-label="Create"
        @submit="submitHandler"
      >
        <!-- todo: this will probably change to username/code? -->
        <!-- todo: check that user exist before send? (form kit validation with debounce) -->
        <FormKit
          label="User ID"
          name="toUserId"
          type="text"
          validation="required"
        />
        <FormKit
          label="Message"
          name="message"
          type="text"
        />
      </FormKit>
    </div>
  </div>
</template>

<script setup lang="ts">
// interfaces
import type FriendRequestInputData from '~/assets/entities/input-data/friend-request'

// stores
import { useUsers } from '~/stores/users'

const emits = defineEmits(['update:value'])

const props = defineProps({
  value: Boolean,
})

const friendRequest = ref<FriendRequestInputData|undefined>()

const usersStore = useUsers()

const submitHandler = async() => {
  if (!friendRequest.value) return

  const result = await usersStore.createFriendRequest(friendRequest.value)

  if (!result) return

  emits('update:value', false)

  console.log(result)
}
</script>
