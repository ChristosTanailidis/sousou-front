<template>
  <div
    v-if="users"
    class="flex flex-col w-full gap-2"
  >
    <!-- todo: user-list.vue => user-list-item.vue - with selections props -->
    <FormKit
      v-if="usersStore.pagination"
      v-model="usersStore.pagination.filter"
      :delay="800"
      label="Search User"
      type="text"
    />
    <div
      v-for="user in users.data"
      :key="user.id"
      class="rounded bg-opacity-10 bg-white text-center cursor-pointer"
      :class="selectedUser?.id === user.id ? 'bg-opacity-20' : ''"
      @click="selectedUser = user"
    >
      {{ user.username }} #{{ user.code }}
    </div>
  </div>
  <!-- debounce -->

  <FormKit
    v-if="selectedUser"
    type="form"
    submit-label="Add Friend"
    @submit="submitHandler"
  >
    <FormKit
      v-model="message"
      label="Message"
      type="text"
    />
  </FormKit>
</template>

<script setup lang="ts">
// interfaces
import { storeToRefs } from 'pinia'
import type FriendRequestInputData from '~/assets/entities/input-data/friend-request'
import type User from '~/assets/entities/user'

// stores
import { useLocalUser } from '~/stores/local-user'
import { useUsers } from '~/stores/users'

const localUserStore = useLocalUser()
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

  console.log('sending from', localUserStore.user)
  console.log('sending to', selectedUser.value)

  const result = await usersStore.createFriendRequest(friendRequestID)

  if (!result) return

  console.log(result)
}
</script>
