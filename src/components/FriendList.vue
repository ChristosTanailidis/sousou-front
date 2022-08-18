<template>
  <q-list
    class="rounded"
  >
    <q-item class="flex flex-col gap-2 p-2">
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
        placeholder="Search in your groups"
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
    <q-item
      v-for="friend in friends"
      :key="friend.id"
      v-ripple
      clickable
    >
      <q-item-section avatar>
        <q-icon
          color="primary"
          name="bluetooth"
        />
      </q-item-section>
      <q-item-section>{{ friend.displayName }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'

// components

// models
import { User } from 'src/models/User'

// stores
import useUserStore from 'src/stores/auth-user'
import { useQuasar } from 'quasar'
import AddFriends from './dialogs/AddFriends.vue'

// utils

export default defineComponent({
  components: {},
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
