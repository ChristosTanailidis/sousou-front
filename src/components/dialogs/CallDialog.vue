<template>
  <q-dialog
    ref="dialogRef"
    position="top"
    seamless
  >
    <q-card
      class="shadow-xl"
      :style="{
        backgroundImage: inCallWithUser?.icon ? `url(${inCallWithUser?.icon})` : 'none',
        backgroundColor: !inCallWithUser?.icon ? 'transparent' : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }"
    >
      <div
        class="w-[25rem] p-2 "
        :class="[
          inCallWithUser?.icon ? 'bg-glass-dark' : 'bg-glass-light'
        ]"
      >
        <q-card-section class="flex flex-row flex-nowrap items-center gap-4 text-[1rem] justify-start">
          <UserImage
            :user="inCallWithUser"
            class="w-[3rem] h-[3rem] rounded overflow-hidden shadow-xl"
          />

          <div class="flex flex-row flex-nowrap gap-1 flex-grow">
            <div v-if="callType === 'caller' && ringing">
              {{ `Calling ${inCallWithUser?.displayName} for sousou` }}
            </div>
            <div v-else-if="callType === 'receiver' && ringing">
              {{ `${inCallWithUser?.displayName} is looking for sousou` }}
            </div>
            <div v-else-if="onCall">
              {{ `In call with ${inCallWithUser?.displayName}` }}
            </div>
          </div>
        </q-card-section>

        <q-card-section class="pr-5">
          <div class="flex flex-row flex-nowrap gap-4 items-center">
            <q-btn
              flat
              round
              dense
              color="primary"
              :icon="micMuted ? 'mic_off' : 'mic'"
              @click="changeMicState()"
            />

            <q-btn
              round
              flat
              dense
              color="primary"
              :icon="volumeLevel <= 0 ? 'volume_off' : 'volume_up'"
              @click="changeSoundState()"
            />

            <q-slider
              v-if="audio"
              v-model="audio.volume"
              :disable="volumeLevel <= 0"
              :min="0"
              :max="1"
              :step="0.1"
            />
          </div>

          <audio
            id="audio"
            ref="audio"
            autoplay
            controls
            class="hidden"
          />
        </q-card-section>

        <!-- buttons example -->
        <q-card-actions
          align="right"
          class="flex flex-row flex-nowrap gap-2"
        >
          <q-btn
            v-if="ringing && callType === 'receiver'"
            unelevated
            color="primary"
            icon="call"
            class="w-full"
            @click="acceptCall()"
          />
          <q-btn
            v-if="ringing && callType === 'receiver'"
            unelevated
            color="negative"
            icon="call_end"
            class="w-full"
            @click="rejectCall()"
          />
          <q-btn
            v-else
            unelevated
            color="negative"
            icon="close"
            class="w-full"
            @click="hangUp()"
          />
        </q-card-actions>
      </div>
    </q-card>
  </q-dialog>
</template>

<!-- eslint-disable no-undef -->
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { storeToRefs } from 'pinia'
import { socket } from 'src/boot/socket_io'

// components
import UserImage from '../reusables/UserImage.vue'

// models
import { PersonalChat } from 'src/models/PersonalChat'
import { PersonalMessage } from 'src/models/PersonalMessage'

// stores
import { useCallStore } from 'src/stores/call-store'

export default defineComponent({
  components: { UserImage },
  emits: [...useDialogPluginComponent.emits],
  setup () {
    const { dialogRef } = useDialogPluginComponent()

    const callStore = useCallStore()
    const { onCall, ringing, callType, peerConnection, audio, micMuted, volumeLevel, inCallWithUser, remoteDescriptionIsSet, callSounds } = storeToRefs(callStore)

    onMounted(async () => {
      callSounds.value.ringingSound.loop = true
      callSounds.value.callingSound.loop = true

      socket.on('receive-candidate', async (data: {personalChat: PersonalChat, candidate: RTCIceCandidate }) => {
        handleNewICECandidateMsg(data.candidate)
      })

      socket.on('answer-call-one-to-one', async (data: { description?: RTCSessionDescriptionInit, callMessage?: PersonalMessage, answer?: boolean, err?: string }) => {
        callStore.receiveAnswer(data.answer, data.description)

        if (data.answer === false) {
          dialogRef.value?.hide()
        }
      })

      socket.on('receive-call-one-to-one', async (data: { callMessage: PersonalMessage, description: RTCSessionDescriptionInit, err?: string }) => {
        if (!dialogRef.value || data.err) {
          return
        }

        if (ringing.value || onCall.value) {
          // already on a call
          socket.emit('answer-call-one-to-one', { callMessageId: data.callMessage?.id, answer: false })
          return
        }

        callStore.receiveCall(data.callMessage, data.description)

        dialogRef.value.show()
      })

      socket.on('end-call-one-to-one', () => {
        dialogRef.value?.hide()
        callStore.clearCall()
      })
    })

    watch(ringing, (val: boolean) => {
      if (val && callType.value === 'caller' && dialogRef.value) {
        dialogRef.value?.show()
        startCall()
      }

      if (val) {
        callType.value === 'caller' ? callSounds.value.callingSound.play() : callSounds.value.ringingSound.play()
      } else {
        callSounds.value.callingSound.pause()
        callSounds.value.callingSound.currentTime = 0

        callSounds.value.ringingSound.pause()
        callSounds.value.ringingSound.currentTime = 0
      }
    })

    const callSetup = async () => {
      await callStore.callSetup()
    }

    const startCall = async () => {
      await callSetup()
      await callStore.startCall()
    }

    const acceptCall = async () => {
      await callSetup()

      callStore.answerCall(true)
    }

    const rejectCall = () => {
      dialogRef.value?.hide()

      callStore.answerCall(false)
      callStore.clearCall()
    }

    const candidates = ref<RTCIceCandidate[]>([])
    const allCandidateReceived = ref(false)

    const handleNewICECandidateMsg = (candidate?: RTCIceCandidateInit) => {
      if (candidate) {
        candidates.value.push(new RTCIceCandidate(candidate))
      } else {
        allCandidateReceived.value = true
      }
    }

    watch([allCandidateReceived, remoteDescriptionIsSet], ([candidatesReceived, descriptionSet]) => {
      if (candidatesReceived && descriptionSet) {
        candidates.value.forEach(c => peerConnection.value?.addIceCandidate(c))
      }
    }, { deep: true })

    const hangUp = () => {
      callStore.hangUp()
      callStore.clearCall()
      dialogRef.value?.hide()
    }

    const changeMicState = () => {
      callStore.changeMicState()
    }

    const changeSoundState = () => {
      callStore.changeSoundVolume()
    }

    return {
      audio,
      micMuted,
      volumeLevel,

      onCall,
      ringing,
      callType,
      inCallWithUser,

      changeMicState,
      changeSoundState,

      acceptCall,
      rejectCall,
      hangUp,

      dialogRef
    }
  }
})
</script>
