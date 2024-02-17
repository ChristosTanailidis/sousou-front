<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin p-2 shadow-none border border-[rgba(255,255,255,0.1)]">
      <q-form
        @submit="sentGroupInvite"
        @reset="cancel"
      >
        <q-card-section>
          <q-input
            v-model="userInviteData.message"
            type="textarea"
            label="Message"
            :rules="[
              val => !!val || 'A message is required',
            ]"
          />
        </q-card-section>

        <!-- buttons example -->
        <q-card-actions align="right">
          <q-btn
            type="submit"
            color="primary"
            label="OK"
            class="flex-grow"
          />
          <q-btn
            type="reset"
            color="primary"
            label="Cancel"
            class="w-[5rem] bg-secondary"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'

// components

// models
import { GroupInviteData } from 'src/models/InputData'
import { User } from 'src/models/User'
import { Group } from 'src/models/Group'

// stores
import { useGroupsStore } from 'src/stores/groups'

// utils

export default defineComponent({
  components: {},
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    },
    group: {
      type: Object as PropType<Group>,
      required: true
    }
  },
  emits: [...useDialogPluginComponent.emits],
  setup (props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    const groupsStore = useGroupsStore()

    const userInviteData = ref<GroupInviteData>({
      groupId: props.group.id,
      toUserId: props.user.id,
      message: `Hi ${props.user.displayName},\nI would like to invite you in ${props.group.name}`
    })

    const sentGroupInvite = async () => {
      const response = await groupsStore.inviteUser(userInviteData.value)

      if (!response) {
        return
      }

      onDialogOK()
    }

    const cancel = () => {
      onDialogCancel()
    }

    return {
      dialogRef,
      onDialogHide,

      userInviteData,
      sentGroupInvite,
      cancel
    }
  }
})
</script>
