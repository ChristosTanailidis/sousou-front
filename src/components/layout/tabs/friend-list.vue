<template>
  <!-- GROUPS -->
  <div
    class="flex flex-col items-center no-wrap gap-y-2 py-2 pl-2"
  >
    <button
      class="btn chip w-full flex no-wrap justify-center"
      @click="flags.show_friend_requests = true"
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
      :mini-state="props.miniState"
      class="h-[43px]"
    />
    <div
      v-if="!friends || !friends.length"
      class="chip h-[43px] bg-dark-base-3 w-full"
    >
      No friends 😓
    </div>
  </div>

  <!-- #DIALOGS -->
  <!-- #CREATE-GROUP-DIALOG -->
  <friend-request-list v-model:value="flags.show_friend_requests" />
</template>

<script setup lang="ts">
import { useUsers } from '~/stores/users'

// components
import FriendListItem from '~/components/list-items/friend-list-item.vue'
import FriendRequestList from '~/components/dialogs/friend-request-list.vue'

const props = defineProps({
  miniState: Boolean,
})

const usersStore = useUsers()

// todo: temporary
onMounted(async() => await usersStore.fetchFriends())

const friends = computed(() => usersStore.friends)

const flags = ref({
  show_friend_requests: false,
})

</script>
