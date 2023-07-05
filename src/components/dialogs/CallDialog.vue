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
            <div v-if="type === 'caller' && callState === 'ringing'">
              {{ `Calling ${inCallWithUser?.displayName} for sousou` }}
            </div>
            <div v-else-if="type === 'receiver' && callState === 'ringing'">
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
            v-if="type === 'receiver' && callState === 'ringing'"
            unelevated
            color="primary"
            icon="call"
            class="w-full"
            @click="answerCall(true)"
          />
          <q-btn
            v-if="type === 'receiver' && callState === 'ringing'"
            unelevated
            color="negative"
            icon="call_end"
            class="w-full"
            @click="answerCall(false)"
          />
          <q-btn
            v-else
            unelevated
            color="negative"
            icon="close"
            class="w-full"
            @click="endCall()"
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

// stores

// utils
type CallStateType = 'ringing' | RTCPeerConnectionState

export default defineComponent({
  components: { UserImage },
  props: {
    personalChatId: {
      type: String,
      default: undefined
    },
    callingMessage: {
      type: Object as PropType<PersonalMessage>,
      default: undefined
    },
    description: {
      type: Object as PropType<RTCSessionDescriptionInit>,
      default: undefined
    },
    type: {
      type: String as PropType<'caller' | 'receiver'>,
      default: 'receiver'
    }
  },
  emits: [...useDialogPluginComponent.emits],
  setup (props) {
    const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

    const audio = ref<HTMLMediaElement>()

    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    let connection: RTCPeerConnection

    let audioMedia: MediaStream
    let callMessageId: string

    // const allCandidatesReceived = ref(false)
    const remoteDescriptionSet = ref(false)

    const callState = ref<CallStateType>()
    // const candidatesToBeAdded = ref<RTCIceCandidate[]>([])
    const micMute = ref(false)
    const volumeState = ref(1)

    onMounted(async () => {
      callState.value = 'ringing'

      connection = new RTCPeerConnection(configuration)

      audioMedia = await navigator.mediaDevices.getUserMedia(
        { audio: true }
      )

      audioMedia.getTracks().forEach(track => connection.addTrack(track, audioMedia))

      if (props.type === 'caller') {
        const callerDescription = await connection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: false
        })

        await connection.setLocalDescription(callerDescription)

        if (props.personalChatId && props.type === 'caller') {
          socket.emit('send-voice-one-to-one', { description: callerDescription, personalChatId: props.personalChatId }, (data: { callMessageId: string }) => {
            callMessageId = data.callMessageId
          })
        }
      }

      /* Socket Events */

      socket.on('receive-candidate', async (data: {personalChat: PersonalChat, candidate: RTCIceCandidate }) => {
        // if (!data.candidate) {
        //   allCandidatesReceived.value = true
        //   return
        // }

        // candidatesToBeAdded.value.push(data.candidate)

        try {
          await connection.addIceCandidate(new RTCIceCandidate(data.candidate))
        } catch (err) {
          console.log('error', err)
        }
      })

      socket.on('answer-call-one-to-one', async (data: { description?: RTCSessionDescriptionInit, callMessage?: PersonalMessage, answer?: boolean, err?: string }) => {
        if (data.err) {
          console.log('ERROR --- ', data.err)
          return
        }

        if (!data.answer) {
          endCall()
        }

        if (!data.description) {
          return
        }

        await connection.setRemoteDescription(data.description)
        remoteDescriptionSet.value = true
      })

      socket.on('end-call-one-to-one', async (/* data : { callMessage: PersonalMessage } */) => { await terminateDialog() })

      /* Connection Events */

      const candidatesToSend: RTCPeerConnectionIceEvent['candidate'][] = []
      connection.onicecandidate = async (e) => {
        candidatesToSend.push(e.candidate)
        if (e.candidate) {
          return
        }

        candidatesToSend.forEach((candidate) => {
          socket.emit('send-candidate', { personalChatId: props.type === 'caller' ? props.personalChatId : props.callingMessage?.personalChat.id, candidate })
        })
      }

      connection.ontrack = async (e) => {
        if (audio.value && audio.value.srcObject !== e.streams[0]) {
          audio.value.srcObject = e.streams[0]
        }
      }

      connection.onconnectionstatechange = () => {
        callState.value = connection.connectionState
      }
    })

    const answerCall = async (answer = true) => {
      if (!props.callingMessage || !props.description) {
        return
      }

      if (props.type === 'receiver') {
        const data: {description?: RTCSessionDescriptionInit, callMessageId: string, answer: boolean} = { callMessageId: props.callingMessage.id, answer }
        if (answer) {
          connection.setRemoteDescription(props.description)
          remoteDescriptionSet.value = true

          const receiverDescription = await connection.createAnswer()
          await connection.setLocalDescription(receiverDescription)

          data.description = receiverDescription
        } else {
          await terminateDialog()
        }

        socket.emit('answer-call-one-to-one', { ...data })
      }
    }

    const endCall = async () => {
      socket.emit('end-call-one-to-one', { callMessageId: props.callingMessage?.id || callMessageId })
      await terminateDialog()
    }

    const terminateDialog = async () => {
      audioMedia.getTracks().forEach(track => track.stop())
      await connection.close()
      onDialogCancel()
    }

    // const addCandidates = () => {
    //   candidatesToBeAdded.value.forEach(async (candidate) => {
    //     try {
    //       await connection.addIceCandidate(new RTCIceCandidate(candidate))
    //     } catch (err) {
    //       console.log('error', err)
    //     }
    //   })
    // }

    // watch([remoteDescriptionSet, allCandidatesReceived], () => {
    //   if (remoteDescriptionSet.value && allCandidatesReceived.value) {
    //     addCandidates()
    //   }
    // })

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
      return personalChats.value.find(pc => pc.id === props.personalChatId || props.callingMessage?.personalChat.id)?.users[0]
    })

    return {
      audio,
      callState,
      micMute,
      volumeState,
      inCallWithUser,

      answerCall,
      endCall,
      changeMicState,
      changeSoundState,

      dialogRef,
      onDialogHide
    }
  }
})
</script>
