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
          Are you sure you want to cancel this invite?
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
import { defineComponent } from 'vue'
import { useDialogPluginComponent } from 'quasar'

// components

// models

// stores
import { useGroupsStore } from 'src/stores/groups'

// utils

export default defineComponent({
  components: {},
  props: {
    id: {
      type: String,
      required: true
    }
  },
  emits: [...useDialogPluginComponent.emits],
  setup (props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    const groupsStore = useGroupsStore()

    const sentGroupInvite = async () => {
      const response = await groupsStore.cancelInvite(props.id)

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

      sentGroupInvite,
      cancel
    }
  }
})
</script>
