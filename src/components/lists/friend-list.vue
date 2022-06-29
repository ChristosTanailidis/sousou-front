<template>
  <!-- GROUPS -->
  <div
    class="flex flex-col items-center gap-y-2 py-2 pl-2"
  >
    <div
      class="btn chip w-full flex justify-center"
    >
      <!-- todo -->
      Add a friend
    </div>

    <button
      class="btn chip w-full flex justify-center"
      @click="openDialog(FriendRequestList)"
    >
      <div>
        See your requests
      </div>
      <div v-if="usersStore.friendRequests?.total">
        {{ usersStore.friendRequests.total }}
      </div>
    </button>

    <friend-list-item
      v-for="friend in friends"
      :key="friend.id"
      :value="friend"
      class="h-[43px]"
    />
    <div
      v-if="!friends || !friends.length"
      class="chip h-[43px] bg-dark-base-3 w-full"
    >
      No friends 😓
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsers } from '~/stores/users'

// components
import { openDialog } from '~/components/core/dialog-manager'

import FriendListItem from '~/components/lists/list-items/friend-list-item.vue'
import FriendRequestList from '~/components/lists/friend-request-list.vue'

const usersStore = useUsers()

// todo: temporary
onMounted(async() => await usersStore.fetchFriends())

const friends = computed(() => usersStore.friends)

</script>
