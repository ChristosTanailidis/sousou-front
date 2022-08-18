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
        <q-card-section>
          <q-input
            v-model="friendRequestData.message"
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
          />
          <q-btn
            type="reset"
            color="primary"
            label="Cancel"
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
import { User } from 'src/models/User'

// stores
import useUsersStore from 'src/stores/users'

// utils

export default defineComponent({
  components: {},
  props: {
    to: {
      type: Object as PropType<User>,
      required: true
    }
  },
  emits: [...useDialogPluginComponent.emits],
  setup (props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    const usersStore = useUsersStore()

    const friendRequestData = ref<FriendRequestInputData>({
      toUserId: props.to.id,
      message: `Hi ${props.to.displayName},\nI would like tou add you as my friend 😄`
    })

    const sendFriendRequest = async () => {
      const response = await usersStore.createFriendReqeust(friendRequestData.value)

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
