<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin">
      <q-form
        class="q-gutter-md"
        @submit="submit"
        @reset="reset"
      >
        <q-card-section>
          <q-input
            v-model="voiceChannelObj.name"
            type="text"
            label="Name"
            :rules="[
              val => !!val || 'Name is required',
              val => val.length > 5 || 'A channel name must contain at least 5 characters'
            ]"
          />
          <q-input
            v-model.number="voiceChannelObj.slowMode"
            type="number"
            label="Slow Mode"
          />
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
import { useDialogPluginComponent } from 'quasar'
import { defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'

// components

// models
import { TextChannelInputData } from 'src/models/InputData'

// stores
import { useGroupsStore } from 'src/stores/groups/index'

// utils

export default defineComponent({
  emits: [...useDialogPluginComponent.emits],
  setup () {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    const groupStore = useGroupsStore()
    const { group } = storeToRefs(groupStore)

    const voiceChannelObj = ref<TextChannelInputData>({
      groupId: group.value?.id || '',
      name: '',
      slowMode: 0
    })

    const submit = () => {
      if (!group.value) {
        return
      }

      groupStore.createTextChannel(voiceChannelObj.value)
      onDialogOK()
    }

    const reset = () => {
      onDialogCancel()
    }

    return {
      dialogRef,

      onDialogHide,
      onDialogOK,
      onDialogCancel,

      submit,
      reset,

      voiceChannelObj
    }
  }
})
</script>
