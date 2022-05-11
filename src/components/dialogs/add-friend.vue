<template>
  <div
    v-if="props.value" class="dialog"
    @click.self="emits('update:value', false)"
  >
    <div
      class="dialog-container"
    >
      <div
        v-if="users"
        class="flex flex-col w-full"
      >
        <!-- todo: user-list.vue => user-list-item.vue - with selections props -->
        <div
          v-for="user in users.data"
          :key="user.id"
          class="rounded bg-opacity-10 bg-white text-center cursor-pointer"
          @click="selectedUser = user"
        >
          {{ user.username }} #{{ user.code }}
        </div>
      </div>
      <!-- debounce -->
      <FormKit
        type="form"
        submit-label="Add Friend"
        @submit="submitHandler"
      >
        <FormKit
          v-model="usersStore.pagination.filter"
          :delay="800"
          label="Search User"
          type="text"
        />
        <FormKit
          v-model="message"
          label="Message"
          type="text"
        />
      </FormKit>
    </div>
  </div>
</template>

<script setup lang="ts">
// interfaces
import { storeToRefs } from 'pinia'
import type FriendRequestInputData from '~/assets/entities/input-data/friend-request'
import type User from '~/assets/entities/user'

// stores
import { useUsers } from '~/stores/users'

const emits = defineEmits(['update:value'])

const props = defineProps({
  value: Boolean,
})

const usersStore = useUsers()
const { users, pagination } = storeToRefs(usersStore)
const { fetchUsers } = useUsers()

pagination.value = {
  page: 1,
  limit: 3,
  filter: '',
}

watch(pagination, async() => {
  await fetchUsers()
}, { deep: true, immediate: true })

// onBeforeMount(async() => await fetchUsers())

const selectedUser = ref<User | undefined>()
const message = ref('')

const submitHandler = async() => {
  if (!selectedUser.value) return

  const friendRequestID: FriendRequestInputData = {
    toUserId: selectedUser.value.id,
    message: message.value,
  }

  const result = await usersStore.createFriendRequest(friendRequestID)

  if (!result) return

  emits('update:value', false)

  console.log(result)
}
</script>
