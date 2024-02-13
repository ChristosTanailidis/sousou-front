<template>
  <q-dialog
    ref="dialogRef"
    position="top"
    seamless
    @hide="onDialogHide"
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
            <div v-if="callType === 'caller' && callState === 'ringing'">
              {{ `Calling ${inCallWithUser?.displayName} for sousou` }}
            </div>
            <div v-else-if="callType === 'receiver' && callState === 'ringing'">
              {{ `${inCallWithUser?.displayName} is looking for sousou` }}
            </div>
            <div v-else-if="callState === 'connected'">
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
              :icon="micMute ? 'mic_off' : 'mic'"
              @click="changeMicState()"
            />

            <q-btn
              round
              flat
              dense
              color="primary"
              :icon="volumeState <= 0 ? 'volume_off' : 'volume_up'"
              @click="changeSoundState()"
            />

            <q-slider
              v-if="audio"
              v-model="audio.volume"
              :disable="volumeState <= 0"
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
            v-if="incomingCall"
            unelevated
            color="primary"
            icon="call"
            class="w-full"
            @click="acceptCall()"
          />
          <q-btn
            v-if="incomingCall"
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
import { PropType, computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { socket } from 'src/boot/socket_io'

// components
import UserImage from '../reusables/UserImage.vue'

// models
import { PersonalChat } from 'src/models/PersonalChat'
import { PersonalMessage } from 'src/models/PersonalMessage'
import { storeToRefs } from 'pinia'
import { useAuthUser } from 'src/stores/auth-user'
import { useCallStore } from 'src/stores/call-store'

// stores

// utils
type CallStateType = 'ringing' | RTCPeerConnectionState

export default defineComponent({
  components: { UserImage },
  emits: [...useDialogPluginComponent.emits],
  setup () {
    const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

    const callStore = useCallStore()
    const { initiateCall, personalChatId, callType } = storeToRefs(callStore)

    watch(initiateCall, (val: boolean) => {
      if (val) {
        dialogRef.value?.show()

        if (callType.value === 'caller') {
          startCall()
        }
      }
    })

    const audio = ref<HTMLMediaElement>()

    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    const peerConnection = ref<RTCPeerConnection | null>()

    const callingMessage = ref()
    const description = ref()

    let audioMedia: MediaStream
    let callMessageId: string

    const callState = ref<CallStateType>()
    const micMute = ref(false)
    const volumeState = ref(1)

    const changeMicState = () => {
      audioMedia.getAudioTracks()[0].enabled = micMute.value
      micMute.value = !micMute.value
    }

    let previousSoundState = 0
    const changeSoundState = () => {
      if (!audio.value) {
        return
      }

      if (audio.value.volume > 0) {
        previousSoundState = audio.value.volume
        audio.value.volume = 0
      } else {
        audio.value.volume = previousSoundState
      }

      volumeState.value = audio.value.volume
    }

    const userStore = useAuthUser()
    const { personalChats } = storeToRefs(userStore)

    const inCallWithUser = computed(() => {
      return personalChats.value.find(pc => pc.id === personalChatId.value || callingMessage.value?.personalChat.id)?.users[0]
    })

    const remoteOffer = ref<RTCSessionDescriptionInit>()
    const incomingCall = ref(false)
    const callActive = ref(false)

    onMounted(async () => {
      const i = ref(0)

      socket.on('receive-candidate', async (data: {personalChat: PersonalChat, candidate: RTCIceCandidate }) => {
        console.log('receive', i.value, data)
        handleNewICECandidateMsg(data.candidate)
        i.value++
      })

      socket.on('answer-call-one-to-one', async (data: { description?: RTCSessionDescriptionInit, callMessage?: PersonalMessage, answer?: boolean, err?: string }) => {
        console.log('dude wtf', data)
        if (data.description && data.answer) {
          handleAnswer(data.description)
          callActive.value = true
        } else {
          callActive.value = false
          // todo: more
        }
      })

      // eslint-disable-next-line no-undef
      socket.on('receive-call-one-to-one', async (data: { callMessage: PersonalMessage, description: RTCSessionDescriptionInit, err?: string }) => {
        console.log('[SOCKET<-] receive-call-one-to-one [[receiver]]', data)

        if (!dialogRef.value) {
          return
        }

        if (callType.value !== 'caller') {
          callType.value = 'receiver'
          if (!callActive.value) {
            remoteOffer.value = description.value
            incomingCall.value = true
          }
        }

        if (data.err) {
          console.log('ERROR --- ', data.err)
          return
        }

        // onCall.value = true

        console.log('halo')
        callingMessage.value = data.callMessage
        description.value = data.description
        remoteOffer.value = description.value
        dialogRef.value.show()
        console.log('halo?')
        // Dialog.create({
        //   component: CallDialog,
        //   componentProps: {
        //     callingMessage: data.callMessage,
        //     description: data.description
        //   }
        // }).onDismiss(() => { onCall.value = false }).onCancel(() => { onCall.value = false })
      })
    })

    const callSetup = async () => {
      try {
        audioMedia = await navigator.mediaDevices.getUserMedia(
          { audio: true, video: false }
        )

        console.log('????')
        peerConnection.value = new RTCPeerConnection(configuration)

        peerConnection.value.onicecandidate = handleICECandidateEvent
        peerConnection.value.ontrack = handleRemoteStreamAdded

        audioMedia.getTracks().forEach(track => peerConnection.value?.addTrack(track, audioMedia))
      } catch (err) {
        console.log('ERROR ----> ', err)
      }
    }

    const startCall = async () => {
      await callSetup()
      if (!peerConnection.value) {
        return
      }

      const callerOffer = await peerConnection.value?.createOffer()
      await peerConnection.value.setLocalDescription(callerOffer)

      socket.emit('send-voice-one-to-one', { description: callerOffer, personalChatId: personalChatId.value }, (data: { callMessageId: string }) => {
        callMessageId = data.callMessageId
      })
      callActive.value = true
    }

    const acceptCall = async () => {
      console.log('[ACCEPT CALL]')
      await callSetup()

      console.log('[ACCEPT CALL] after callSetup()')
      if (!peerConnection.value || !remoteOffer.value) {
        console.log('[ACCEPT CALL] NOT HAVING peerConnection and remoteOffer')
        return
      }

      console.log('[ACCEPT CALL] has peerConnection and remoteOffer')
      incomingCall.value = false
      await peerConnection.value.setRemoteDescription(new RTCSessionDescription(remoteOffer.value))
      const answer = await peerConnection.value.createAnswer()
      await peerConnection.value.setLocalDescription(answer)

      const data = { callMessageId: callingMessage.value?.id, answer: true }

      console.log('apantaw edw bro', answer)
      socket.emit('answer-call-one-to-one', { ...data, description: answer })

      callActive.value = true
    }

    const rejectCall = () => {
      const data = { callMessageId: callingMessage.value?.id, answer: false }
      socket.emit('answer-call-one-to-one', { ...data })

      incomingCall.value = false
      remoteOffer.value = undefined
      // Additional cleanup logic here if needed
    }

    const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
      console.log('PIRA APANTISI EGW VAZW REMOTE AN EINAI')
      await peerConnection.value?.setRemoteDescription(new RTCSessionDescription(answer))
    }

    const handleNewICECandidateMsg = (candidate?: RTCIceCandidateInit) => {
      console.log('before try', candidate)
      try {
        if (peerConnection.value) {
          peerConnection.value.addIceCandidate(new RTCIceCandidate(candidate))
        }
      } catch (err) {
        console.log('AAAAAAAAAAAAAAAA', err)
      }
    }

    const handleICECandidateEvent = (event?: RTCPeerConnectionIceEvent) => {
      if (event?.candidate) {
        console.log('Candidate ---- ', event)
        socket.emit('send-candidate', { personalChatId: callType.value === 'caller' ? personalChatId.value : callingMessage.value?.personalChat.id, candidate: event.candidate })
      }
    }

    const handleRemoteStreamAdded = (event: RTCTrackEvent) => {
      if (audio.value && audio.value.srcObject !== event.streams[0]) {
        audio.value.srcObject = event.streams[0]
      }
    }

    const hangUp = () => {
      if (peerConnection.value) {
        peerConnection.value?.close()
        peerConnection.value = null
      }

      socket.emit('end-call-one-to-one', { callMessageId: callingMessage.value?.id || callMessageId })
    }

    return {
      audio,
      callState,
      micMute,
      volumeState,
      inCallWithUser,
      incomingCall,

      callType,

      callingMessage,
      description,

      changeMicState,
      changeSoundState,

      acceptCall,
      rejectCall,
      hangUp,

      dialogRef,
      onDialogHide
    }
  }
})
</script>
