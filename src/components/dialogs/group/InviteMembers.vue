<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin overflow-hidden shadow-none border border-[rgba(255,255,255,0.1)] w-[30rem]">
      <UserList
        v-model:pagination="pagination"
        :users="users"
        class="w-full"
      >
        <template #default="{ user }">
          <q-btn
            v-if="user.pending"
            unelevated
            icon="delete"
            label="Cancel Invitation"
            class="absolute right-0 top-0 w-full h-full bg-red-700/0 hover:bg-red-700/70 opacity-0 hover:opacity-100 transition-all"
            @click="promptCancelInvite(user.pending)"
          />
          <q-btn
            v-else
            unelevated
            icon="add"
            label="Invite User"
            class="absolute right-0 top-0 w-full h-full bg-glass-primary opacity-0 hover:opacity-100 transition-all"
            @click="promptInviteUser(user)"
          />
        </template>
      </UserList>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'

// components
import InviteUserPrompt from '../prompts/InviteUserPrompt.vue'
import CancelInviteUserPrompt from '../prompts/CancelInviteUserPrompt.vue'
import UserList from '../../reusables/UserList.vue'

// models
import { UserPaginationData } from 'src/models/PaginationData'
import { Group } from 'src/models/Group'
import { UserToInvite } from 'src/models/User'

// stores
import { useInviteUsersStore } from 'src/stores/groups/users-to-invite'

// utils

export default defineComponent({
  components: { UserList },
  props: {
    group: {
      type: Object as PropType<Group>,
      required: true
    }
  },
  emits: [...useDialogPluginComponent.emits],
  setup (props) {
    const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

    const usersToInvite = useInviteUsersStore()

    const { users } = storeToRefs(usersToInvite)

    const pagination = ref<UserPaginationData>({
      limit: 6,
      page: 1,
      filter: ''
    })

    onMounted(async () => {
      await usersToInvite.fetch(pagination.value, props.group.id)
    })

    watch(pagination, async () => {
      await usersToInvite.fetch(pagination.value, props.group.id)
    }, { deep: true })

    const $q = useQuasar()

    const promptInviteUser = (user: UserToInvite) => {
      $q.dialog({
        component: InviteUserPrompt,
        componentProps: {
          user,
          group: props.group
        }
      }).onOk(() => {
        onDialogOK()
      })
    }

    const promptCancelInvite = (id: string) => {
      $q.dialog({
        component: CancelInviteUserPrompt,
        componentProps: {
          id
        }
      }).onOk(() => {
        onDialogOK()
      })
    }

    return {
      dialogRef,
      onDialogHide,

      promptInviteUser,
      promptCancelInvite,

      users,
      pagination
    }
  }
})
</script>
