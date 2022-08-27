<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin">
      <UserList
        v-if="users"
        v-model:pagination="pagination"
        :users="users"
        @user-select="promptAddFriend"
      />
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'

// components
import UserList from '../reusables/UserList.vue'
import AddFriendPrompt from './prompts/AddFriendPrompt.vue'

// models
import { UserPaginationData } from 'src/models/PaginationData'
import { User } from 'src/models/User'

// stores
import useUsersStore from 'src/stores/users'

// utils

export default defineComponent({
  components: { UserList },
  props: {},
  emits: [...useDialogPluginComponent.emits],
  setup () {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    const usersStore = useUsersStore()
    const { users, total, loading } = storeToRefs(usersStore)

    const pagination = ref<UserPaginationData>({
      limit: 6,
      page: 1,
      filter: ''
    })

    watch(pagination, () => {
      usersStore.fetch(pagination.value)
    }, { deep: true, immediate: true })

    const $q = useQuasar()

    const promptAddFriend = (user: User) => {
      $q.dialog({
        component: AddFriendPrompt,
        componentProps: {
          to: user
        }
      }).onOk(() => {
        onDialogOK()
      })
    }

    return {
      dialogRef,
      onDialogHide,

      promptAddFriend,

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
