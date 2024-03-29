<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin overflow-hidden shadow-none border border-[rgba(255,255,255,0.1)] w-[30rem]">
      <UserList
        v-if="users"
        v-model:pagination="pagination"
        :users="users"
        class="w-full"
      >
        <template #default="{ user }">
          <q-btn
            v-if="user.pending"
            unelevated
            icon="delete"
            label="Cancel Friend Request"
            class="absolute right-0 top-0 w-full h-full bg-red-700/0 hover:bg-red-700/70 opacity-0 hover:opacity-100 transition-all"
            @click="promptCancelRequest(user.pending)"
          />
          <q-btn
            v-else
            unelevated
            icon="add"
            label="Add friend"
            class="absolute right-0 top-0 w-full h-full bg-glass-primary opacity-0 hover:opacity-100 transition-all"
            @click="promptAddFriend(user)"
          />
        </template>
      </UserList>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'

// components
import UserList from '../../reusables/UserList.vue'
import AddFriendPrompt from '../prompts/AddFriendPrompt.vue'
import CancelFriendRequestPrompt from '../prompts/CancelFriendRequestPrompt.vue'

// models
import { UserPaginationData } from 'src/models/PaginationData'
import { UserToAdd } from 'src/models/User'

// stores
import { useAddUsersStore } from 'src/stores/users/users-to-add'

// utils

export default defineComponent({
  components: { UserList },
  props: {},
  emits: [...useDialogPluginComponent.emits],
  setup () {
    const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

    const usersStore = useAddUsersStore()
    const { users, total, loading } = storeToRefs(usersStore)

    const pagination = ref<UserPaginationData>({
      limit: 6,
      page: 1,
      filter: ''
    })

    watch(pagination, async () => {
      await usersStore.fetch(pagination.value)
    }, { deep: true, immediate: true })

    const $q = useQuasar()

    const promptAddFriend = (user: UserToAdd) => {
      $q.dialog({
        component: AddFriendPrompt,
        componentProps: {
          to: user
        }
      }).onOk(async () => {
        await usersStore.fetch(pagination.value)
      })
    }

    const promptCancelRequest = (id: string) => {
      $q.dialog({
        component: CancelFriendRequestPrompt,
        componentProps: {
          id
        }
      }).onOk(async () => {
        await usersStore.fetch(pagination.value)
      })
    }

    return {
      dialogRef,
      onDialogHide,

      promptAddFriend,
      promptCancelRequest,

      onCancelClick: onDialogCancel,

      users,
      total,
      loading,
      pagination
    }
  }
})
</script>

<style lang="sass" scoped>
// todo: delete this
.overlapping
  position: absolute
</style>
