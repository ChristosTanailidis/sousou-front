<template>
  <q-list
    class="rounded p-2"
  >
    <q-item class="flex flex-col gap-2 p-0">
      <q-btn
        flat
        no-caps
        color="primary"
        icon="add"
        label="Add a friend"
        class="w-full"
        @click="openAddFriend"
      />
      <q-input
        v-model="search"
        dense
        borderless
        rounded
        debounce="750"
        type="search"
        placeholder="Search in your friend list"
        class="w-full bg-dark-50 rounded px-2"
      >
        <template #append>
          <q-icon
            name="search"
            color="primary"
          />
        </template>
      </q-input>
    </q-item>

    <!-- Friend -->
    <UserItem
      v-for="friend in friends"
      :key="friend.id"
      :user="friend"
    />
  </q-list>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'

// components
import AddFriends from './dialogs/user/AddFriends.vue'
import UserItem from './reusables/UserItem.vue'

// models
import { User } from 'src/models/User'

// stores
import useUserStore from 'src/stores/auth-user'

// utils

export default defineComponent({
  components: { UserItem },
  props: { },
  emits: [],
  setup () {
    const userStore = useUserStore()
    const { user } = storeToRefs(userStore)

    const search = ref('')

    const friends = computed(() => {
      const friends = user.value?.friendList ? user.value.friendList : [] as User[]
      return friends.filter(
        (user) =>
          user.code.includes(search.value) ||
          user.displayName.includes(search.value) ||
          user.email.includes(search.value) ||
          user.username.includes(search.value)
      )
    })

    const $q = useQuasar()

    const openAddFriend = () => {
      $q.dialog({
        component: AddFriends
      }).onOk(async () => {
        await userStore.fetchUser()
      })
    }

    return {
      user,
      friends,
      search,
      openAddFriend
    }
  }
})
</script>
