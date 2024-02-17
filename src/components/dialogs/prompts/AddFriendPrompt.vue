<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin">
      <q-form
        @submit="sendFriendRequest"
        @reset="cancel"
      >
        <q-card-section v-if="!to.pending">
          <q-input
            v-model="friendRequestData.message"
            type="textarea"
            label="Message"
            :rules="[
              (val: any) => !!val || 'A message is required',
            ]"
          />
        </q-card-section>
        <q-card-section v-else>
          Are you sure you want to delete this request?
        </q-card-section>

        <!-- buttons example -->
        <q-card-actions align="right">
          <q-btn
            type="submit"
            color="primary"
            label="OK"
            class="w-[5rem]"
          />
          <q-btn
            type="reset"
            color="primary"
            label="Cancel"
            class="w-[5rem]"
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
import { FriendRequestInputData } from 'src/models/InputData'
import { UserToAdd } from 'src/models/User'

// stores
import { useUsersStore } from 'src/stores/users'
import { useAuthUser } from 'src/stores/auth-user'

// utils

export default defineComponent({
  components: {},
  props: {
    to: {
      type: Object as PropType<UserToAdd>,
      required: true
    }
  },
  emits: [...useDialogPluginComponent.emits],
  setup (props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    const usersStore = useUsersStore()

    const friendRequestData = ref<FriendRequestInputData>({
      toUserId: props.to.id,
      message: `Hi ${props.to.displayName},\nI would like to add you as my friend 😄`
    })

    const sendFriendRequest = async () => {
      if (props.to.pending) {
        cancelFriendRequest()
        return
      }

      const response = await usersStore.createFriendRequest(friendRequestData.value)

      if (!response) {
        return
      }

      onDialogOK()
    }

    const cancelFriendRequest = async () => {
      const { user } = useAuthUser()
      if (!user) {
        return
      }

      const friendRequestId = user.myFriendRequests.find(fr => fr.toUser.id === props.to.id)

      if (!friendRequestId) {
        return
      }

      const response = await usersStore.cancelFriendRequest(friendRequestId.id)

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

      friendRequestData,
      sendFriendRequest,
      cancel
    }
  }
})
</script>
