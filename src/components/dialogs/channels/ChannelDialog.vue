<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin">
      <q-form
        class="q-gutter-md"
        @submit="childComponent[channelType].submit"
        @reset="childComponent[channelType].reset"
      >
        <q-card-section>
          <component
            :is="childComponent[channelType].component"
            v-bind="{...childComponent[channelType].childProps}"
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
import { defineComponent, PropType } from 'vue'
import { useDialogPluginComponent } from 'quasar'

// components
import TextChannel from './TextChannel.vue'
import VoiceChannel from './VoiceChannel.vue'

// models

// stores

// utils

export default defineComponent({
  components: {},
  props: {
    channelType: {
      type: String as PropType<'text' | 'voice'>,
      default: 'text'
    },
    channel: {
      // used for editing an existing channel
      type: Object,
      default: undefined
    }
  },
  emits: [...useDialogPluginComponent.emits],
  setup (props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    const childComponent = {
      text: {
        component: TextChannel,
        childProps: { textChannel: props.channel || { fakeField: 'op! :D' } },
        submit: () => { console.log('to text form egine submit') },
        reset: () => { console.log('to text form egine reset') }
      },
      voice: {
        component: VoiceChannel,
        childProps: { voiceChannel: props.channel || { fakeField: 'ep!' } },
        submit: () => { console.log('to voice form egine submit') },
        reset: () => { console.log('to voice form egine reset') }
      }
    }

    return {
      dialogRef,
      onDialogHide,

      onOKClick () {
        onDialogOK()
      },

      onCancelClick: onDialogCancel,

      childComponent
    }
  }
})
</script>
