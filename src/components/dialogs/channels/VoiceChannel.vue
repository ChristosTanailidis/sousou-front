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
              val => val.length > 5 || 'A channel name must contain least 5 characters'
            ]"
          />
          <q-input
            v-model.number="voiceChannelObj.maxUsers"
            type="number"
            label="Max Users"
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
import { VoiceChannelInputData } from 'src/models/InputData'

// stores
import { useGroupsStore } from 'src/stores/groups/index'

// utils

export default defineComponent({
  emits: [...useDialogPluginComponent.emits],
  setup () {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    const groupStore = useGroupsStore()
    const { group } = storeToRefs(groupStore)

    const voiceChannelObj = ref<VoiceChannelInputData>({
      groupId: group.value?.id || '',
      name: '',
      maxUsers: 20
    })

    const submit = () => {
      if (!group.value) {
        return
      }

      groupStore.createVoiceChannel(voiceChannelObj.value)
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
