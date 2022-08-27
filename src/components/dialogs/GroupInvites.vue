<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="my-card">
      <UserList
        v-model:pagination="pagination"
        :users="users"
        @user-select="manageInvitation"
      />
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'

// components
import InviteUserPrompt from './prompts/InviteUserPrompt.vue'
import CancelInviteUserPrompt from './prompts/CancelInviteUserPrompt.vue'
import UserList from '../reusables/UserList.vue'

// models
import { UserPaginationData } from 'src/models/PaginationData'
import { Group } from 'src/models/Group'
import { User } from 'src/models/User'

// stores
import usUsersToInviteStore from 'src/stores/groups/users-to-invite'
// import useGroupsStore from 'src/stores/groups'

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
    const { dialogRef, onDialogHide } = useDialogPluginComponent()

    const usersToInvite = usUsersToInviteStore()
    // const groupsStore = useGroupsStore()

    const { users } = storeToRefs(usersToInvite)
    // const { groups } = storeToRefs(groupsStore)

    const pagination = ref<UserPaginationData>({
      limit: 6,
      page: 1,
      filter: ''
    })

    onMounted(async () => {
      // todo: this will need a groupId soon
      await usersToInvite.fetch(pagination.value)
    })

    watch(pagination, async () => {
      await usersToInvite.fetch(pagination.value)
    }, { deep: true })

    const $q = useQuasar()

    // todo: to existing paizei na mhn xreiazetai an erxetai apo ton user
    const manageInvitation = (user: User) => {
      // todo: if user.available
      if (user) {
        // todo: efoson einai existing to invite, kane find sta invites pou den uparxoun twra
        // kai des to id tou invite vasei tou xrhsth kai tou group,
        // better solution: to existing ginetai [inviteId?: string]
        // sto users kai apo kei perneis katheutheian to inviteId gia to cancel

        $q.dialog({
          component: CancelInviteUserPrompt,
          componentProps: {
            inviteId: 'todo'
          }
        }).onOk(() => true)
          .onCancel(() => false)
      } else {
        $q.dialog({
          component: InviteUserPrompt,
          componentProps: {
            user,
            group: props.group
          }
        }).onOk(() => true)
          .onCancel(() => false)
      }
    }

    return {
      dialogRef,
      onDialogHide,

      users,
      pagination,
      manageInvitation
    }
  }
})
</script>
