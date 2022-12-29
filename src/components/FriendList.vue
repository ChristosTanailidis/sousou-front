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
    <router-link
      v-for="personalChat in personalChats"
      :key="personalChat.id"
      :to="'/friend/' + personalChat.id"
    >
      <UserItem
        :user="personalChat.friend"
      />
    </router-link>
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

// stores
import { useAuthUser } from 'src/stores/auth-user'

// utils

export default defineComponent({
  components: { UserItem },
  props: { },
  emits: [],
  setup () {
    const userStore = useAuthUser()
    const { user } = storeToRefs(userStore)

    const search = ref('')

    const personalChats = computed(() => {
      const personalChats = user.value?.personalChats.map(pc => {
        return {
          id: pc.personalChat.id,
          friend: pc.users[0]
        }
      })

      if (!personalChats) {
        return []
      }

      return personalChats

      // return personalChats.filter(
      //   (pc) =>
      //     pc.friend.code.includes(search.value) ||
      //     pc.friend.displayName.includes(search.value) ||
      //     pc.friend.email.includes(search.value) ||
      //     pc.friend.username.includes(search.value)
      // )
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
      personalChats,
      search,
      openAddFriend
    }
  }
})
</script>
